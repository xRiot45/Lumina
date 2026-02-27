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
