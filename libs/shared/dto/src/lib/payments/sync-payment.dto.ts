import { ISyncPaymentStatusResponse, OrderStatus } from '@lumina/shared-interfaces';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SyncPaymentStatusPayloadDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsUUID('4', { message: 'Order ID must be a valid UUID' })
    @IsString()
    @IsNotEmpty()
    orderId!: string;
}

export class SyncPaymentStatusResponseDto implements ISyncPaymentStatusResponse {
    @IsString()
    @IsNotEmpty()
    status!: OrderStatus;

    @IsBoolean()
    @IsNotEmpty()
    isChanged!: boolean;
}
