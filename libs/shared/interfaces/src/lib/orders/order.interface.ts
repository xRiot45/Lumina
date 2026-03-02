import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { LuminaCourier, LuminaServiceType } from '../enums/shipping.enum';
import { IPaymentActionInfo } from '../payments/payment-action.interface';

export interface ICreateOrder {
    shippingAddressId: string;
    courier: LuminaCourier;
    serviceType: LuminaServiceType;
    paymentMethod: PaymentMethod;
    notes?: string;
}

export interface IShippingAddressSnapshot {
    recipientName: string;
    phoneNumber: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    fullAddress: string;
    landmark?: string | null;
}

export interface IOrderItemResponse {
    id: string;
    productId: string;
    productName: string;
    variantId?: string | null;
    variantSku?: string | null;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

export interface IOrderResponse {
    id: string;
    orderNumber: string;
    userId: string;
    status: OrderStatus;

    totalAmount: number;
    shippingCost: number;

    shippingAddress: IShippingAddressSnapshot;
    courier: string;
    serviceType: string;
    trackingNumber?: string | null;
    notes?: string | null;

    paymentMethod: PaymentMethod;
    paymentGatewayId?: string | null;
    paymentActionInfo?: IPaymentActionInfo | null;

    paidAt?: Date | null;
    canceledAt?: Date | null;
    canceledReason?: string | null;

    items: IOrderItemResponse[];

    createdAt: Date;
    updatedAt: Date;
}

export interface IProductVariantSnapshot {
    id: string;
    sku: string;
    price: number | string;
}

export interface IProductDetailSnapshot {
    id: string;
    name: string;
    basePrice: number | string;
    image?: string | null;
    variants?: IProductVariantSnapshot[];
}

export interface ICartItemSnapshot {
    productId: string;
    variantId?: string | null;
    quantity: number;
    product?: { id: string };
    variant?: { id: string };
    cartId?: string;
}

export interface ICartResponseSnapshot {
    data: ICartItemSnapshot[];
}
