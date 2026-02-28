import { IsUUID, IsNotEmpty, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ICreateOrderRequest, LuminaCourier, LuminaServiceType, PaymentMethod } from '@lumina/shared-interfaces';

export class CreateOrderDto implements ICreateOrderRequest {
    @IsUUID('4', { message: 'Shipping Address ID must be a valid UUID' })
    @IsNotEmpty({ message: 'Shipping Address ID is required' })
    shippingAddressId!: string;

    @IsEnum(LuminaCourier, { message: 'Invalid courier selected' })
    @IsNotEmpty({ message: 'Courier is required' })
    courier!: LuminaCourier;

    @IsEnum(LuminaServiceType, { message: 'Invalid service type selected' })
    @IsNotEmpty({ message: 'Service Type is required' })
    serviceType!: LuminaServiceType;

    @IsEnum(PaymentMethod, { message: 'Invalid payment method selected. Please choose a supported method.' })
    @IsNotEmpty({ message: 'Payment method is required' })
    paymentMethod!: PaymentMethod;

    @IsOptional()
    @MaxLength(500, { message: 'Notes cannot exceed 500 characters' })
    notes?: string;
}
