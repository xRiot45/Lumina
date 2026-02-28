import { LuminaCourier, LuminaServiceType } from '../enums/shipping.enum';

export interface ICreateOrderRequest {
    shippingAddressId: string;
    courier: LuminaCourier;
    serviceType: LuminaServiceType;
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
