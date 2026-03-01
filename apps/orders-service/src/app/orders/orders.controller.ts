import { CreateEnrichedOrderPayloadDto } from '@lumina/shared-dto';
import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @MessagePattern({ cmd: 'create_order' })
    async createOrder(@Payload() payload: CreateEnrichedOrderPayloadDto) {
        return await this.ordersService.createOrder(payload);
    }
}
