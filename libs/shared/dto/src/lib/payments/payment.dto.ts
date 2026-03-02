import { IsNotEmpty, IsObject, IsString, IsUUID, ValidateNested } from 'class-validator';
import { IChargePayment, IUpdatePaymentInfo } from '@lumina/shared-interfaces';
import type { IChargePaymentResponse, IPaymentActionInfo } from '@lumina/shared-interfaces';
import { Expose, Transform, Type } from 'class-transformer';

// DTO For API-Gateway
export class ChargePaymentDto implements IChargePayment {
    @IsUUID('4', { message: 'Order ID must be a valid UUID' })
    @IsNotEmpty()
    orderId!: string;
}

// DTO For Microservices
export class ChargePaymentPayloadDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsNotEmpty()
    userId!: string;

    @ValidateNested()
    @Type(() => ChargePaymentDto)
    @IsNotEmpty()
    data!: ChargePaymentDto;
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

export class ChargePaymentResponseDto implements IChargePaymentResponse {
    @Expose()
    orderId!: string;

    @Expose()
    paymentGatewayId!: string;

    @Expose()
    paymentMethod!: string;

    @Expose()
    totalAmount!: number;

    @Expose()
    status!: string;

    @Expose()
    @Transform(({ obj }) => obj.paymentActionInfo)
    paymentActionInfo!: IPaymentActionInfo;
}
