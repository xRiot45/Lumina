import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';
import { IChargePayment, IUpdatePaymentInfo } from '@lumina/shared-interfaces';
import type { IPaymentActionInfo } from '@lumina/shared-interfaces';

export class ChargePaymentDto implements IChargePayment {
    @IsUUID('4', { message: 'Order ID must be a valid UUID' })
    @IsNotEmpty()
    orderId!: string;
}

export class UpdatePaymentInfoDto implements IUpdatePaymentInfo {
    @IsUUID('4', { message: 'Order ID must be a valid UUID' })
    @IsNotEmpty()
    orderId!: string;

    @IsString()
    @IsNotEmpty()
    paymentGatewayId!: string;

    @IsObject()
    @IsNotEmpty()
    paymentActionInfo!: IPaymentActionInfo;
}
