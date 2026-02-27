import { IsUUID, IsNotEmpty, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ICreateOrderRequest, LuminaCourier, LuminaServiceType } from '@lumina/shared-interfaces';

export class CreateOrderDto implements ICreateOrderRequest {
    @IsUUID('4', { message: 'Shipping Address ID must be a valid UUID' })
    @IsNotEmpty()
    shippingAddressId!: string;

    @IsEnum(LuminaCourier, { message: 'Invalid courier selected' })
    @IsNotEmpty()
    courier!: LuminaCourier;

    @IsEnum(LuminaServiceType, { message: 'Invalid service type selected' })
    @IsNotEmpty()
    serviceType!: LuminaServiceType;

    @IsOptional()
    @MaxLength(500)
    notes?: string;
}
