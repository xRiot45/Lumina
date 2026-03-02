import { IPaymentActionInfo } from './payment-action.interface';

export interface IChargePayment {
    orderId: string;
}

export interface IUpdatePaymentInfo {
    orderId: string;
    paymentGatewayId: string;
    paymentActionInfo: IPaymentActionInfo;
}
