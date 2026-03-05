import {
    ChargePaymentPayloadDto,
    ChargePaymentResponseDto,
    GetPaymentInfoPaylaodDto,
    GetPaymentInfoResponseDto,
    PayOrderPayloadDto,
    PayOrderResponseDto,
    XenditWebhookPayloadDto,
} from '@lumina/shared-dto';

import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @MessagePattern({ cmd: 'charge_payment' })
    async chargePayment(@Payload() payload: ChargePaymentPayloadDto): Promise<ChargePaymentResponseDto> {
        return await this.paymentsService.chargePayment(payload?.userId, payload?.data?.orderId);
    }

    @MessagePattern({ cmd: 'get_payment_info' })
    async getPaymentInfo(@Payload() payload: GetPaymentInfoPaylaodDto): Promise<GetPaymentInfoResponseDto> {
        return await this.paymentsService.getPaymentInfo(payload?.userId, payload?.orderId);
    }

    @MessagePattern({ cmd: 'pay_order' })
    async payOrder(@Payload() payload: PayOrderPayloadDto): Promise<PayOrderResponseDto> {
        return await this.paymentsService.payOrder(payload?.userId, payload?.data?.orderId);
    }

    @EventPattern('process_xendit_webhook')
    async handleXenditWebhook(@Payload() payload: XenditWebhookPayloadDto): Promise<void> {
        return await this.paymentsService.handleXenditWebhook(payload?.callbackToken, payload?.data);
    }
}
