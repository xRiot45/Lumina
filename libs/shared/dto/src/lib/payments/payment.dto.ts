import { IsNotEmpty, IsObject, IsString, IsUUID, ValidateNested } from 'class-validator';
import { IChargePayment, IUpdatePaymentInfo } from '@lumina/shared-interfaces';
import type {
    IChargePaymentResponse,
    IGetPaymentInfoResponse,
    IPaymentActionInfo,
    IPayOrderRequest,
    IPayOrderResponse,
    OrderStatus,
} from '@lumina/shared-interfaces';
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

export class GetPaymentInfoPaylaodDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsNotEmpty()
    userId!: string;

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

export class GetPaymentInfoResponseDto implements IGetPaymentInfoResponse {
    @Expose()
    orderId!: string;

    @Expose()
    orderNumber!: string;

    @Expose()
    status!: string;

    @Expose()
    totalAmount!: number;

    @Expose()
    paymentMethod!: string;

    @Expose()
    @Transform(({ obj }) => obj.paymentActionInfo)
    paymentActionInfo!: IPaymentActionInfo | null;

    @Expose()
    createdAt!: Date | string;

    @Expose()
    paidAt?: Date | string | null;

    @Expose()
    canceledAt?: Date | string | null;

    @Expose()
    canceledReason?: string | null;
}

export class PayOrderDto implements IPayOrderRequest {
    @IsUUID('4', { message: 'Order ID must be a valid UUID' })
    @IsNotEmpty()
    orderId!: string;
}

export class PayOrderResponseDto implements IPayOrderResponse {
    @Expose() orderId!: string;
    @Expose() orderNumber!: string;
    @Expose() status!: OrderStatus;
    @Expose() paidAt!: Date | string;
}

export class PayOrderPayloadDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsNotEmpty()
    userId!: string;

    @ValidateNested()
    @Type(() => PayOrderDto)
    @IsNotEmpty()
    data!: PayOrderDto;
}
