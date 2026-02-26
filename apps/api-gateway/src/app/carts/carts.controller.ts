import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CurrentUser, Roles } from '@lumina/shared-common';
import type { IAuthenticatedUser } from '@lumina/shared-interfaces';
import { UserRole } from '@lumina/shared-interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
    AddToCartDto,
    BaseResponseDto,
    CartResponseDto,
    EnrichedCartItemResponseDto,
    PaginationDto,
} from '@lumina/shared-dto';

@Controller('carts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartsController {
    constructor(private readonly cartsService: CartsService) {}

    @Post('items')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.CREATED)
    async addToCart(
        @CurrentUser() user: IAuthenticatedUser,
        @Body() body: AddToCartDto,
    ): Promise<BaseResponseDto<CartResponseDto>> {
        const result = await this.cartsService.addToCart(user?.id, body);
        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            timestamp: new Date(),
            message: 'Product added to cart successfully',
            data: result,
        };
    }

    @Get()
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async getCart(
        @CurrentUser() user: IAuthenticatedUser,
        @Query() query: PaginationDto,
    ): Promise<BaseResponseDto<EnrichedCartItemResponseDto[]>> {
        const result = await this.cartsService.getCart(user?.id, query);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Carts retrieved successfully',
            data: result.data,
            meta: result.meta,
        };
    }

    @Delete('items/:cartItemId')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async deleteItemFromCart(
        @CurrentUser() user: IAuthenticatedUser,
        @Param('cartItemId') cartItemId: string,
    ): Promise<BaseResponseDto> {
        await this.cartsService.deleteItemFromCart(user?.id, cartItemId);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Cart item deleted successfully',
        };
    }
}
