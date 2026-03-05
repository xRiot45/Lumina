import { Body, Controller, Get, HttpCode, HttpStatus, Param, Headers, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CurrentUser, Public, Roles } from '@lumina/shared-common';
import { UserRole } from '@lumina/shared-interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { IAuthenticatedUser, IXenditWebhook } from '@lumina/shared-interfaces';
import {
    BaseResponseDto,
    ChargePaymentDto,
    ChargePaymentResponseDto,
    GetPaymentInfoResponseDto,
    PayOrderDto,
    PayOrderResponseDto,
} from '@lumina/shared-dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('charge')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.CREATED)
    async chargePayment(
        @CurrentUser() user: IAuthenticatedUser,
        @Body() dto: ChargePaymentDto,
    ): Promise<BaseResponseDto<ChargePaymentResponseDto>> {
        const result = await this.paymentsService.chargePayment(user?.id, dto);
        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            timestamp: new Date(),
            message: 'Payment charged successfully',
            data: result,
        };
    }

    @Get('order/:orderId')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async getPaymentInfo(
        @CurrentUser() user: IAuthenticatedUser,
        @Param('orderId') orderId: string,
    ): Promise<BaseResponseDto<GetPaymentInfoResponseDto>> {
        const result = await this.paymentsService.getPaymentInfo(user?.id, orderId);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Payment info found successfully',
            data: result,
        };
    }

    @Post('pay')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async payOrder(
        @CurrentUser() user: IAuthenticatedUser,
        @Body() dto: PayOrderDto,
    ): Promise<BaseResponseDto<PayOrderResponseDto>> {
        const result = await this.paymentsService.payOrder(user?.id, dto);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message:
                'Payment simulation successfully triggered. The system is awaiting Webhook confirmation from Xendit.',
            data: result,
        };
    }

    @Public()
    @Post('webhook/xendit')
    @HttpCode(HttpStatus.OK)
    async handleXenditWebhook(
        @Headers('x-callback-token') callbackToken: string,
        @Body() dto: IXenditWebhook,
    ): Promise<void> {
        await this.paymentsService.handleXenditWebhook(callbackToken, dto);
    }
}
