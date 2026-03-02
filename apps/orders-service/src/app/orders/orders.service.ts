import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../core/database/entities/order.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { autoGenerateOrderNumber, calculateShippingCost, mapToDto } from '@lumina/shared-utils';
import {
    ICartItemSnapshot,
    ICartResponseSnapshot,
    IProductDetailSnapshot,
    IProductVariantSnapshot,
    IShippingAddressSnapshot,
    OrderStatus,
} from '@lumina/shared-interfaces';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderResponseDto } from '@lumina/shared-dto';

@Injectable()
export class OrdersService {
    private readonly context = `[SERVICE] ${OrdersService.name}`;

    constructor(
        @Inject('CARTS_SERVICE') private readonly cartsClient: ClientProxy,
        @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
        @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        private readonly logger: LoggerService,
    ) {}

    async createOrder(userId: string, data: CreateOrderDto): Promise<OrderResponseDto> {
        this.logger.log(`Orchestrating new order for user: ${userId}`, this.context);

        try {
            const cartPayload = {
                userId,
                query: { limit: 100, page: 1 },
            };

            const [cart, userAddress] = await Promise.all([
                firstValueFrom(this.cartsClient.send<ICartResponseSnapshot>({ cmd: 'get_cart' }, cartPayload)),
                firstValueFrom(
                    this.usersClient.send<IShippingAddressSnapshot>({ cmd: 'get_user_address_detail' }, userId),
                ),
            ]);

            if (!cart || !cart.data || cart.data.length === 0) {
                throw new RpcException({
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: 'Cart empty',
                    error: 'Unprocessable Entity',
                });
            }

            if (!userAddress) {
                throw new RpcException({
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: 'Shipping address is invalid or not found.',
                    error: 'Unprocessable Entity',
                });
            }

            const productFetchPromises = cart.data.map(async (item: ICartItemSnapshot) => {
                const targetProductId = item.product?.id || item.productId;
                const productDetail = await firstValueFrom(
                    this.productsClient.send<IProductDetailSnapshot>({ cmd: 'find_product_by_id' }, targetProductId),
                );

                if (!productDetail) {
                    throw new RpcException({
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                        message: `Product with ID ${targetProductId} not found.`,
                        error: 'Unprocessable Entity',
                    });
                }

                return { item, productDetail };
            });

            const enrichedCartItems = await Promise.all(productFetchPromises);

            let cartTotalAmount = 0;
            const orderItems = enrichedCartItems.map(({ item, productDetail }) => {
                const targetVariantId = item.variant?.id || item.variantId;

                // 1. Set harga default pakai harga dasar produk
                let unitPrice = Number(productDetail.basePrice);
                let variantSku: string | null = null;

                // 2. Jika ada varian, jalankan Model 1 (Harga Varian MENIMPA Harga Dasar)
                if (targetVariantId) {
                    const variant = productDetail.variants?.find(
                        (v: IProductVariantSnapshot) => v.id === targetVariantId,
                    );
                    if (!variant) {
                        throw new RpcException({
                            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                            message: `Product variant not found.`,
                            error: 'Unprocessable Entity',
                        });
                    }

                    // Harga ditimpa mutlak oleh harga varian
                    unitPrice = Number(variant.price);
                    variantSku = variant.sku;
                }

                const itemQuantity = Number(item.quantity);
                const itemSubTotal = unitPrice * itemQuantity;

                cartTotalAmount += itemSubTotal;

                return {
                    productId: productDetail.id,
                    variantId: targetVariantId,
                    productName: productDetail.name,
                    variantSku: variantSku,
                    productImage: productDetail.image || null,
                    quantity: itemQuantity,
                    unitPrice: unitPrice,
                    subTotal: itemSubTotal,
                };
            });

            const shippingCost = calculateShippingCost(data.serviceType);
            const finalTotalAmount = cartTotalAmount + shippingCost;

            const newOrder = this.orderRepository.create({
                orderNumber: autoGenerateOrderNumber(),
                userId: userId,
                status: OrderStatus.PENDING_PAYMENT,
                totalAmount: finalTotalAmount,
                shippingCost: shippingCost,
                shippingAddress: userAddress,
                courier: data.courier,
                serviceType: data.serviceType,
                paymentMethod: data.paymentMethod,
                notes: data.notes,
                items: orderItems,
            } as OrderEntity);

            const savedOrder = await this.orderRepository.save(newOrder);
            this.logger.log(`Successfully created order ${savedOrder.orderNumber}`, this.context);

            return mapToDto(OrderResponseDto, savedOrder);
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to create order: ${errorMessage}`, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while creating the order',
                error: 'Internal Server Error',
            });
        }
    }

    async findById(orderId: string): Promise<OrderResponseDto> {
        this.logger.log(`Fetching order by ID: ${orderId}`, this.context);

        try {
            const order = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: ['items'],
            });

            if (!order) {
                this.logger.warn({ message: 'Order not found', orderId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Order not found',
                    error: 'Not Found',
                });
            }

            return mapToDto(OrderResponseDto, order);
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to find order by id: ${errorMessage}`, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while finding order by id',
                error: 'Internal Server Error',
            });
        }
    }
}
