import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CurrentUser, Roles } from '@lumina/shared-common';
import type { IAuthenticatedUser } from '@lumina/shared-interfaces';
import { UserRole } from '@lumina/shared-interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AddToCartDto, BaseResponseDto, CartResponseDto } from '@lumina/shared-dto';

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
}
