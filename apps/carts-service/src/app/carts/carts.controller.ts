import { CARTS_COMMAND_PATTERN } from '@lumina/shared-common';
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

    @MessagePattern(CARTS_COMMAND_PATTERN.ADD_TO_CART)
    async addToCart(@Payload() payload: AddToCartPayloadDto): Promise<CartResponseDto> {
        return await this.cartsService.addToCart(payload.userId, payload.data);
    }

    @MessagePattern(CARTS_COMMAND_PATTERN.GET_CART)
    async getCart(@Payload() payload: IGetCartPayload): Promise<IPaginatedResponse<EnrichedCartItemResponseDto>> {
        return await this.cartsService.getCart(payload.userId, payload.query);
    }

    @MessagePattern(CARTS_COMMAND_PATTERN.DELETE_ITEM_FROM_CART)
    async deleteItemFromCart(@Payload() payload: IDeleteItemFromCartPayload): Promise<{ success: boolean }> {
        return await this.cartsService.deleteItemFromCart(payload.userId, payload.cartItemId);
    }

    @MessagePattern(CARTS_COMMAND_PATTERN.DELETE_CART)
    async deleteCart(@Payload() payload: IDeleteCartPayload): Promise<{ success: boolean }> {
        return await this.cartsService.deleteCart(payload.userId, payload.cartId);
    }

    @MessagePattern(CARTS_COMMAND_PATTERN.UPDATE_ITEM_QUANTITY)
    async updateItemQuantity(@Payload() payload: IUpdateCartItemPayload) {
        return await this.cartsService.updateItemQuantity(payload.userId, payload.cartItemId, payload.quantity);
    }
}
