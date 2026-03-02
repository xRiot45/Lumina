import { IsUUID, IsNotEmpty, IsOptional, MaxLength, IsEnum, IsString, ValidateNested } from 'class-validator';
import {
    IPaymentActionInfo,
    LuminaCourier,
    LuminaServiceType,
    OrderStatus,
    PaymentMethod,
} from '@lumina/shared-interfaces';
import { Expose, Type } from 'class-transformer';
import type {
    ICreateOrder,
    IOrderItemResponse,
    IOrderResponse,
    IShippingAddressSnapshot,
} from '@lumina/shared-interfaces';

// For API Gateway
export class CreateOrderDto implements ICreateOrder {
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

export class FindOrderByIdDto {
    @IsUUID('4', { message: 'Order ID must be a valid UUID' })
    @IsNotEmpty({ message: 'Order ID is required' })
    @IsString()
    orderId!: string;
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

export class FindOrderByIdPayloadDto {
    @IsUUID('4', { message: 'Order ID must be a valid UUID' })
    @IsNotEmpty({ message: 'Order ID is required' })
    @IsString()
    orderId!: string;
}

export class ShippingAddressSnapshotDto implements IShippingAddressSnapshot {
    @Expose() recipientName!: string;
    @Expose() phoneNumber!: string;
    @Expose() province!: string;
    @Expose() city!: string;
    @Expose() district!: string;
    @Expose() postalCode!: string;
    @Expose() fullAddress!: string;
    @Expose() landmark?: string | null;
}

export class OrderItemResponseDto implements IOrderItemResponse {
    @Expose() id!: string;
    @Expose() productId!: string;
    @Expose() productName!: string;
    @Expose() variantId?: string | null;
    @Expose() variantSku?: string | null;
    @Expose() quantity!: number;
    @Expose() unitPrice!: number;
    @Expose() subTotal!: number;
}

export class OrderResponseDto implements IOrderResponse {
    @Expose() id!: string;
    @Expose() orderNumber!: string;
    @Expose() userId!: string;
    @Expose() status!: OrderStatus;

    @Expose() totalAmount!: number;
    @Expose() shippingCost!: number;

    @Expose()
    @Type(() => ShippingAddressSnapshotDto)
    shippingAddress!: ShippingAddressSnapshotDto;

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
