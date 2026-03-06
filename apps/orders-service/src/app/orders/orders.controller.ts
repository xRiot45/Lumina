import {
    CreateOrderPayloadDto,
    OrderResponseDto,
    UpdateOrderStatusDto,
    UpdatePaymentInfoDto,
} from '@lumina/shared-dto';
import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @MessagePattern({ cmd: 'create_order' })
    async createOrder(@Payload() payload: CreateOrderPayloadDto): Promise<OrderResponseDto> {
        return await this.ordersService.createOrder(payload?.userId, payload?.data);
    }

    @MessagePattern({ cmd: 'find_order_by_id' })
    async findById(@Payload() payload: { orderId: string }): Promise<OrderResponseDto> {
        return await this.ordersService.findById(payload?.orderId);
    }

    @MessagePattern({ cmd: 'update_payment_info' })
    async updatePaymentInfo(@Payload() payload: UpdatePaymentInfoDto) {
        return await this.ordersService.updatePaymentInfo(payload);
    }

    @MessagePattern({ cmd: 'update_order_status_to_paid' })
    async updateOrderStatusToPaid(@Payload() payload: UpdateOrderStatusDto): Promise<OrderResponseDto> {
        return await this.ordersService.updateOrderStatusToPaid(payload);
    }

    @MessagePattern({ cmd: 'find_order_by_number' })
    async findOrderByNumber(@Payload() orderNumber: string) {
        return await this.ordersService.findOrderByNumber(orderNumber);
    }
}
