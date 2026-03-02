import { ChargePaymentPayloadDto, ChargePaymentResponseDto } from '@lumina/shared-dto';

import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @MessagePattern({ cmd: 'charge_payment' })
    async chargePayment(@Payload() payload: ChargePaymentPayloadDto): Promise<ChargePaymentResponseDto> {
        return await this.paymentsService.chargePayment(payload?.userId, payload?.data?.orderId);
    }
}
