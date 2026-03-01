import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../core/database/entities/order.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { CreateEnrichedOrderPayloadDto } from '@lumina/shared-dto';
import { autoGenerateOrderNumber } from '@lumina/shared-utils';
import { OrderStatus } from '@lumina/shared-interfaces';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
    private readonly context = `[SERVICE] ${OrdersService.name}`;

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        private readonly logger: LoggerService,
    ) {}

    async createOrder(payload: CreateEnrichedOrderPayloadDto): Promise<OrderEntity> {
        this.logger.log(`[OrdersService] Creating new order for user: ${payload.userId}`, this.context);

        try {
            const orderNumber = autoGenerateOrderNumber();

            const newOrder = this.orderRepository.create({
                orderNumber,
                userId: payload.userId,
                status: OrderStatus.PENDING_PAYMENT,

                totalAmount: payload.totalAmount,
                shippingCost: payload.shippingCost,
                shippingAddress: payload.shippingAddress,

                courier: payload.orderData.courier,
                serviceType: payload.orderData.serviceType,
                paymentMethod: payload.orderData.paymentMethod,
                notes: payload.orderData.notes,
            });

            newOrder.items = payload.cartItems.map((cartItem: any) => {
                return {
                    productId: cartItem.productId,
                    variantId: cartItem.variantId,
                    productName: cartItem.productName,
                    variantSku: cartItem.variantSku,
                    productImage: cartItem.productImage,

                    quantity: cartItem.quantity,

                    basePrice: cartItem.basePrice,
                    variantPrice: cartItem.variantPrice,
                    unitPrice: cartItem.unitPrice,
                    subTotal: cartItem.subTotal,
                } as any; // Cast ke any atau OrderItemEntity
            });

            const savedOrder = await this.orderRepository.save(newOrder);

            this.logger.log(`Successfully created order ${savedOrder.orderNumber}`, this.context);

            return savedOrder;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(`[OrdersService] Failed to create order: ${errorMessage}`, errorStack);

            // Lempar sebagai RpcException agar ditangkap secara akurat oleh Gateway
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Gagal menyimpan pesanan ke database.',
                error: 'Internal Server Error',
            });
        }
    }
}
