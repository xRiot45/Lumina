import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CurrentUser, Roles } from '@lumina/shared-common';
import { UserRole } from '@lumina/shared-interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { IAuthenticatedUser } from '@lumina/shared-interfaces';
import { BaseResponseDto, ChargePaymentDto, ChargePaymentResponseDto } from '@lumina/shared-dto';

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
}
