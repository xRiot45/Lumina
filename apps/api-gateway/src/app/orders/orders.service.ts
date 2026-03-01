import { CreateOrderDto, OrderResponseDto } from '@lumina/shared-dto';
import { IShippingAddressSnapshot } from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { calculateShippingCost, isMicroserviceError } from '@lumina/shared-utils';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
    private readonly context = `[GATEWAY] ${OrdersService.name}`;

    constructor(
        @Inject('CARTS_SERVICE') private readonly cartsClient: ClientProxy,
        @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
        @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
        @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
        // @Inject('PAYMENTS_SERVICE') private readonly paymentsClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async checkout(userId: string, dto: CreateOrderDto): Promise<OrderResponseDto> {
        this.logger.log({ message: 'Starting checkout process for userId', userId }, this.context);

        try {
            const payload = {
                userId,
                data: {
                    shippingAddressId: dto.shippingAddressId,
                    serviceType: dto.serviceType,
                },
            };

            const cartPayload = {
                userId: payload?.userId,
                query: { limit: 100, page: 1 },
            };

            const cart = await firstValueFrom(this.cartsClient.send({ cmd: 'get_cart' }, cartPayload));

            // 🔥 PERBAIKAN: Gunakan cart.data sesuai struktur IPaginatedResponse
            if (!cart || !cart.data || cart.data.length === 0) {
                this.logger.log({ message: 'Cart empty' }, this.context);
                throw new BadRequestException('Cart empty');
            }

            const userAddress = await firstValueFrom(
                this.usersClient.send({ cmd: 'get_user_address_detail' }, payload?.userId),
            );

            if (!userAddress) {
                this.logger.log({ message: 'Shipping address is invalid or not found' }, this.context);
                throw new BadRequestException('Shipping address is invalid or not found.');
            }

            const addressSnapshot: IShippingAddressSnapshot = {
                recipientName: userAddress.recipientName,
                phoneNumber: userAddress.phoneNumber,
                province: userAddress.province,
                city: userAddress.city,
                district: userAddress.district,
                postalCode: userAddress.postalCode,
                fullAddress: userAddress.fullAddress,
                landmark: userAddress.landmark,
            };

            let cartTotalAmount = 0;
            const enrichedCartItems = [];

            // 🔥 TAHAP ENRICHMENT: Mengambil detail product & merakit harga secara akurat
            for (const item of cart.data) {
                // Ekstrak ID dari objek nested product
                const currentProductId = item.product?.id || item.productId;

                const productDetail = await firstValueFrom(
                    this.productsClient.send({ cmd: 'find_product_by_id' }, currentProductId),
                );

                if (!productDetail) {
                    throw new BadRequestException(`Produk dengan ID ${currentProductId} tidak ditemukan.`);
                }

                const currentVariantId = item.variant?.id || item.variantId;

                // Set harga dasar dari produk
                const basePrice = Number(productDetail.basePrice);
                let variantPrice = 0;
                let unitPrice = basePrice;
                let variantSku = null;

                // Jika kustomer memilih varian, timpa unitPrice dengan harga varian
                if (currentVariantId) {
                    const variant = productDetail.variants?.find((v: any) => v.id === currentVariantId);
                    if (!variant) {
                        throw new BadRequestException(`Varian produk tidak ditemukan.`);
                    }
                    variantPrice = Number(variant.price);
                    unitPrice = variantPrice;
                    variantSku = variant.sku;
                }

                // Kalkulasi Subtotal item ini (Jumlah x Harga Satuan)
                const itemQuantity = Number(item.quantity);
                const itemSubTotal = unitPrice * itemQuantity;

                cartTotalAmount += itemSubTotal;

                // 🔥 PERBAIKAN: Rakit payload dengan nama kolom yang SANGAT PERSIS dengan Entity Anda
                enrichedCartItems.push({
                    productId: currentProductId,
                    productName: productDetail.name,
                    variantId: currentVariantId,
                    variantSku: variantSku,
                    productImage: productDetail.image || null, // Ambil gambar dari produk
                    quantity: itemQuantity,
                    basePrice: basePrice,
                    variantPrice: variantPrice,
                    unitPrice: unitPrice,
                    subTotal: itemSubTotal,
                });
            }

            // Asumsi utility calculateShippingCost mengembalikan number
            // const shippingCost = calculateShippingCost(dto.serviceType);
            const shippingCost = calculateShippingCost(dto?.serviceType); // Hardcoded sementara untuk testing jika fungsi belum siap

            const finalTotalAmount = cartTotalAmount + shippingCost;

            const enrichedOrderPayload = {
                userId,
                orderData: dto,
                cartItems: enrichedCartItems,
                totalAmount: finalTotalAmount,
                shippingCost: shippingCost,
                shippingAddress: addressSnapshot,
            };

            this.logger.log(`Sending order payload to orders-service for userId: ${userId}`, this.context);

            const rawCreatedOrder = await firstValueFrom(
                this.ordersClient.send({ cmd: 'create_order' }, enrichedOrderPayload),
            );

            this.cartsClient.emit({ cmd: 'delete_cart' }, userId);

            this.logger.log({ message: 'Checkout successfully for userId: ' + userId }, this.context);

            // Asumsi mapToDto merubah entity raw menjadi OrderResponseDto
            return rawCreatedOrder; // Sesuaikan jika Anda menggunakan mapToDto(OrderResponseDto, rawCreatedOrder)
        } catch (error: unknown) {
            this.logger.error(`[Gateway] Raw Error from Carts Microservice: ${JSON.stringify(error)}`);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException(
                    {
                        statusCode: status,
                        message: message,
                        error: errorName,
                    },
                    status,
                );
            }

            if (error instanceof Error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: error.message,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Unknown Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
