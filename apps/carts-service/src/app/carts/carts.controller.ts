import { AddToCartPayloadDto, CartResponseDto, EnrichedCartItemResponseDto } from '@lumina/shared-dto';
import type {
    IDeleteCartPayload,
    IDeleteItemFromCartPayload,
    IGetCartPayload,
    IPaginatedResponse,
    IUpdateCartItemPayload,
} from '@lumina/shared-interfaces';
import { Controller } from '@nestjs/common';
import { CartsService } from './carts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @MessagePattern({ cmd: 'add_to_cart' })
    async addToCart(@Payload() payload: AddToCartPayloadDto): Promise<CartResponseDto> {
        return await this.cartsService.addToCart(payload.userId, payload.data);
    }

    @MessagePattern({ cmd: 'get_cart' })
    async getCart(@Payload() payload: IGetCartPayload): Promise<IPaginatedResponse<EnrichedCartItemResponseDto>> {
        return await this.cartsService.getCart(payload.userId, payload.query);
    }

    @MessagePattern({ cmd: 'delete_item_from_cart' })
    async deleteItemFromCart(@Payload() payload: IDeleteItemFromCartPayload): Promise<{ success: boolean }> {
        return await this.cartsService.deleteItemFromCart(payload.userId, payload.cartItemId);
    }

    @MessagePattern({ cmd: 'delete_cart' })
    async deleteCart(@Payload() payload: IDeleteCartPayload): Promise<{ success: boolean }> {
        return await this.cartsService.deleteCart(payload.userId, payload.cartId);
    }

    @MessagePattern({ cmd: 'update_item_quantity' })
    async updateItemQuantity(@Payload() payload: IUpdateCartItemPayload) {
        return await this.cartsService.updateItemQuantity(payload.userId, payload.cartItemId, payload.quantity);
    }
}
