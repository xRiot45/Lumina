import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../core/database/entities/order.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { autoGenerateOrderNumber, calculateShippingCost, mapToDto } from '@lumina/shared-utils';
import {
    ICartItemSnapshot,
    ICartResponseSnapshot,
    IPaginatedResponse,
    IProductDetailSnapshot,
    IProductVariantSnapshot,
    IShippingAddressSnapshot,
    OrderStatus,
} from '@lumina/shared-interfaces';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
    CreateOrderDto,
    OrderPaginationDto,
    OrderResponseDto,
    UpdateOrderStatusDto,
    UpdateOrderStatusToPaidDto,
    UpdatePaymentInfoDto,
} from '@lumina/shared-dto';

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

            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 1);

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
                paymentExpiresAt: expirationDate,
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

    async updatePaymentInfo(data: UpdatePaymentInfoDto): Promise<OrderResponseDto> {
        this.logger.log(`Updating payment info for order: ${data.orderId}`, this.context);

        try {
            const order = await this.orderRepository.findOne({
                where: {
                    id: data.orderId,
                },
            });

            if (!order) {
                this.logger.warn(`Order not found for payment update: ${data.orderId}`, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order with ID ${data.orderId} not found.`,
                    error: 'Not Found',
                });
            }

            order.paymentGatewayId = data.paymentGatewayId;
            order.paymentActionInfo = data.paymentActionInfo;

            const savedOrder = await this.orderRepository.save(order);

            this.logger.log(`Successfully updated payment info for order: ${savedOrder.orderNumber}`, this.context);

            return mapToDto(OrderResponseDto, savedOrder);
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to update payment info: ${errorMessage}`, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while updating payment info',
                error: 'Internal Server Error',
            });
        }
    }

    async updateOrderStatusToPaid(payload: UpdateOrderStatusToPaidDto): Promise<OrderResponseDto> {
        this.logger.log(`Received command to update order ${payload.orderId} to status ${payload.status}`);

        try {
            const order = await this.orderRepository.findOne({
                where: { id: payload.orderId },
            });

            if (!order) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order with ID ${payload.orderId} not found.`,
                });
            }

            if (order.status === OrderStatus.CANCELED) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Cannot change status. Order ${order.id} is already canceled.`,
                });
            }

            order.status = payload.status;
            if (payload.paidAt) {
                order.paidAt = new Date(payload.paidAt);
            }

            const updatedOrder = await this.orderRepository.save(order);

            this.logger.log(`Order ${updatedOrder.id} status successfully changed to ${updatedOrder.status}`);

            return mapToDto(OrderResponseDto, updatedOrder);
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to update order status: ${errorMessage}`, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while updating order status',
                error: 'Internal Server Error',
            });
        }
    }

    async findOrderByNumber(orderNumber: string) {
        const order = await this.orderRepository.findOne({
            where: { orderNumber },
            relations: ['items'],
        });
        return order;
    }

    async updateOrderStatus(orderId: string, data: UpdateOrderStatusDto): Promise<{ success: boolean }> {
        this.logger.log({ message: 'Initiating admin order status update', orderId }, this.context);

        try {
            const orderDetail = await this.orderRepository.findOne({
                where: { id: orderId },
            });

            if (!orderDetail) {
                this.logger.warn({ message: 'Order not found for status update', orderId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order with ID ${orderId} not found.`,
                    error: 'Not Found',
                });
            }

            if (orderDetail.status === data.status) {
                this.logger.log(
                    { message: 'Order status is already up to date, skipping update', orderId },
                    this.context,
                );
                return { success: true };
            }

            const validTransitions: Record<OrderStatus, OrderStatus[]> = {
                [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID], // Admin bisa manual update ke PAID (misal via bank transfer manual)
                [OrderStatus.PAID]: [OrderStatus.PROCESSING],
                [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
                [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
                [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
                [OrderStatus.COMPLETED]: [],
                [OrderStatus.CANCELED]: [],
            };

            const allowedNextStatuses = validTransitions[orderDetail.status as OrderStatus] || [];

            if (!allowedNextStatuses.includes(data.status)) {
                this.logger.warn(
                    {
                        message: `Invalid admin status transition from ${orderDetail.status} to ${data.status}`,
                        orderId,
                    },
                    this.context,
                );
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Admin cannot transition order status from ${orderDetail.status} to ${data.status}.`,
                    error: 'Bad Request',
                });
            }

            const now = new Date();
            switch (data.status) {
                case OrderStatus.PAID:
                    orderDetail.paidAt = now;
                    break;
                case OrderStatus.PROCESSING:
                    orderDetail.processingAt = now;
                    break;
                case OrderStatus.SHIPPED:
                    orderDetail.shippedAt = now;
                    break;
                case OrderStatus.DELIVERED:
                    orderDetail.deliveredAt = now;
                    break;
                case OrderStatus.COMPLETED:
                    orderDetail.completedAt = now;
                    break;
            }

            orderDetail.status = data.status;

            await this.orderRepository.save(orderDetail);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to update order status: ${errorMessage}`, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while updating order status',
                error: 'Internal Server Error',
            });
        }
    }

    async confirmOrder(userId: string, orderId: string): Promise<{ success: boolean }> {
        this.logger.log({ message: 'Initiating order confirmation', orderId }, this.context);

        try {
            const orderDetail = await this.orderRepository.findOne({
                where: { id: orderId },
            });

            if (!orderDetail) {
                this.logger.warn({ message: 'Order not found for confirmation', orderId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order with ID ${orderId} not found.`,
                    error: 'Not Found',
                });
            }

            if (orderDetail.userId !== userId) {
                this.logger.warn({ message: 'Unauthorized order confirmation attempt', orderId, userId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `Order with ID ${orderId} not found.`,
                    error: 'Not Found',
                });
            }

            if (orderDetail.status === OrderStatus.COMPLETED) {
                this.logger.log({ message: 'Order is already confirmed, bypassing', orderId }, this.context);
                return { success: true };
            }

            const confirmableStatuses = [OrderStatus.SHIPPED, OrderStatus.DELIVERED];
            if (!confirmableStatuses.includes(orderDetail.status as OrderStatus)) {
                this.logger.warn(
                    { message: `Attempted to confirm order with invalid status: ${orderDetail.status}`, orderId },
                    this.context,
                );
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: `Cannot confirm order. Current status is ${orderDetail.status}. Order must be SHIPPED or DELIVERED.`,
                    error: 'Bad Request',
                });
            }

            orderDetail.status = OrderStatus.COMPLETED;
            orderDetail.completedAt = new Date();

            await this.orderRepository.save(orderDetail);

            this.logger.log({ message: 'Order successfully confirmed', orderId }, this.context);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            // Typo diperbaiki
            this.logger.error(`Failed to confirm order: ${errorMessage}`, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while confirming the order',
                error: 'Internal Server Error',
            });
        }
    }

    async findAll(payload: OrderPaginationDto): Promise<IPaginatedResponse<OrderResponseDto>> {
        this.logger.log('Fetching all orders', this.context);

        try {
            const page = payload?.page ?? 1;
            const limit = payload?.limit ?? 10;
            const order = payload?.order ?? 'ASC';

            const skip = (page - 1) * limit;

            const whereCondition: FindOptionsWhere<OrderEntity> = {};

            if (payload?.search) {
                whereCondition.orderNumber = ILike(`%${payload.search}%`);
            }

            if (payload?.status) {
                whereCondition.status = payload.status;
            }

            const [orders, totalItems] = await this.orderRepository.findAndCount({
                where: whereCondition,
                order: { orderNumber: order },
                skip: skip,
                take: limit,
            });

            const totalPages = Math.ceil(totalItems / limit);
            const result: IPaginatedResponse<OrderResponseDto> = {
                data: orders,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                },
            };

            this.logger.log('Orders fetched successfully', this.context);
            return result;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to fetch orders: ${errorMessage}`, errorStack, this.context);
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while fetching orders',
                error: 'Internal Server Error',
            });
        }
    }

    async findAllMyOrders(userId: string, data?: OrderPaginationDto): Promise<IPaginatedResponse<OrderResponseDto>> {
        this.logger.log('Fetching my orders', this.context);

        try {
            const page = data?.page ?? 1;
            const limit = data?.limit ?? 10;
            const order = data?.order ?? 'ASC';

            const skip = (page - 1) * limit;

            const whereCondition: FindOptionsWhere<OrderEntity> = {};

            if (data?.search) {
                whereCondition.orderNumber = ILike(`%${data.search}%`);
            }

            if (data?.status) {
                whereCondition.status = data.status;
            }

            whereCondition.userId = userId;

            const [orders, totalItems] = await this.orderRepository.findAndCount({
                where: whereCondition,
                order: { orderNumber: order },
                skip: skip,
                take: limit,
            });

            const totalPages = Math.ceil(totalItems / limit);
            const result: IPaginatedResponse<OrderResponseDto> = {
                data: orders,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                },
            };

            this.logger.log('My orders fetched successfully', this.context);
            return result;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`Failed to fetch my orders: ${errorMessage}`, errorStack, this.context);
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while fetching my orders',
                error: 'Internal Server Error',
            });
        }
    }
}
