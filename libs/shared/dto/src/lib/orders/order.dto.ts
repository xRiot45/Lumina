import {
    IsUUID,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    IsEnum,
    IsString,
    ValidateNested,
    IsArray,
    IsNumber,
} from 'class-validator';
import {
    ICreateOrderRequest,
    IOrderItemResponse,
    IOrderResponse,
    IPaymentActionInfo,
    LuminaCourier,
    LuminaServiceType,
    OrderStatus,
    PaymentMethod,
} from '@lumina/shared-interfaces';
import { Expose, Type } from 'class-transformer';
import type { IShippingAddressSnapshot } from '@lumina/shared-interfaces';

// For API Gateway
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

// For Microservices
export class CreateOrderPayloadDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsNotEmpty({ message: 'User ID is required' })
    @IsString()
    userId!: string;

    @IsNotEmpty({ message: 'Order data is required' })
    @ValidateNested()
    @Type(() => CreateOrderDto)
    data!: CreateOrderDto;
}

export class OrderItemResponseDto implements IOrderItemResponse {
    @Expose() id!: string;
    @Expose() productId!: string;
    @Expose() productName!: string;
    @Expose() variantId?: string | null;
    @Expose() variantName?: string | null;
    @Expose() quantity!: number;
    @Expose() price!: number;
    @Expose() subtotal!: number;
}

export class OrderResponseDto implements IOrderResponse {
    @Expose() id!: string;
    @Expose() orderNumber!: string;
    @Expose() userId!: string;
    @Expose() status!: OrderStatus;

    @Expose() totalAmount!: number;
    @Expose() shippingCost!: number;

    @Expose() shippingAddress!: IShippingAddressSnapshot;

    @Expose() courier!: string;
    @Expose() serviceType!: string;
    @Expose() trackingNumber?: string | null;
    @Expose() notes?: string | null;

    @Expose() paymentMethod!: PaymentMethod;
    @Expose() paymentGatewayId?: string | null;
    @Expose() paymentActionInfo?: IPaymentActionInfo | null;

    @Expose() paidAt?: Date | null;
    @Expose() canceledAt?: Date | null;
    @Expose() canceledReason?: string | null;

    @Expose()
    @Type(() => OrderItemResponseDto)
    items!: OrderItemResponseDto[];

    @Expose() createdAt!: Date;
    @Expose() updatedAt!: Date;
}

export class CreateEnrichedOrderPayloadDto {
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ValidateNested()
    @Type(() => CreateOrderDto)
    @IsNotEmpty()
    orderData!: CreateOrderDto;

    @IsArray()
    @IsNotEmpty()
    cartItems!: any[]; // Ganti 'any' dengan CartItemDto/Interface Anda jika ada

    @IsNumber()
    totalAmount!: number;

    @IsNumber()
    shippingCost!: number;

    @IsNotEmpty()
    shippingAddress!: IShippingAddressSnapshot;
}
