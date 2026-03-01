import { BaseResponseDto, CreateOrderDto, OrderResponseDto } from '@lumina/shared-dto';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, Roles } from '@lumina/shared-common';
import { UserRole } from '@lumina/shared-interfaces';
import type { IAuthenticatedUser } from '@lumina/shared-interfaces';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post('checkout')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.CREATED)
    async checkout(
        @CurrentUser() user: IAuthenticatedUser,
        @Body() dto: CreateOrderDto,
    ): Promise<BaseResponseDto<OrderResponseDto>> {
        const result = await this.ordersService.checkout(user?.id, dto);
        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            timestamp: new Date(),
            message: 'Order created successfully',
            data: result,
        };
    }
}
