import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { LuminaCourier, LuminaServiceType } from '../enums/shipping.enum';
import { IPaymentActionInfo } from './payment-action.interface';

export interface ICreateOrderRequest {
    shippingAddressId: string;
    courier: LuminaCourier;
    serviceType: LuminaServiceType;
    paymentMethod: PaymentMethod;
    notes?: string;
}

export interface ICreateOrderPayload {
    userId: string;
    orderData: ICreateOrderRequest;
    cartItems: any[];
    cartTotalAmount: number;
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
    variantName?: string | null;
    quantity: number;
    price: number;
    subtotal: number;
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
