import { IPaymentActionInfo } from './payment-action.interface';

export interface IChargePayment {
    orderId: string;
}

export interface IUpdatePaymentInfo {
    orderId: string;
    paymentGatewayId: string;
    paymentActionInfo: IPaymentActionInfo;
}

export interface IChargePaymentResponse {
    orderId: string;
    paymentGatewayId: string;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    paymentActionInfo: IPaymentActionInfo;
}

export type XenditReusability = 'ONE_TIME_USE' | 'MULTIPLE_USE';

export type XenditBankCode =
    | 'BCA'
    | 'MANDIRI'
    | 'BRI'
    | 'BNI'
    | 'PERMATA'
    | 'CIMB'
    | 'BSI'
    | 'BJB'
    | 'SAHABAT_SAMPOERNA';

export interface IXenditVirtualAccountParam {
    type: 'VIRTUAL_ACCOUNT';
    reusability: XenditReusability;
    virtualAccount: {
        channelCode: XenditBankCode;
        channelProperties: {
            customerName: string;
        };
    };
}

export interface IXenditQrCodeParam {
    type: 'QR_CODE';
    reusability: XenditReusability;
    qrCode: {
        channelCode: 'QRIS';
    };
}

export type IXenditPaymentMethodParam = IXenditVirtualAccountParam | IXenditQrCodeParam;
