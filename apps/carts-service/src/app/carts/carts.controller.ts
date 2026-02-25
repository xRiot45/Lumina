import { CartResponseDto } from '@lumina/shared-dto';
import type { IAddToCartRequest, ICartActionPayload } from '@lumina/shared-interfaces';
import { Controller } from '@nestjs/common';
import { CartsService } from './carts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @MessagePattern({ cmd: 'add_to_cart' })
    async addToCart(@Payload() payload: ICartActionPayload) {
        return await this.cartsService.addToCart(payload.userId, payload.data as IAddToCartRequest);
    }
}
