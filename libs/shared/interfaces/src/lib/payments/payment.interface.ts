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
    | 'BNC'
    | 'BSS'
    | 'MUAMALAT';
export type XenditEwalletChannelCode =
    | 'DANA'
    | 'OVO'
    | 'GOPAY'
    | 'SHOPEEPAY'
    | 'ASTRAPAY'
    | 'JENIUSPAY'
    | 'LINKAJA'
    | 'NEXCASH';

export interface IXenditVirtualAccountParam {
    type: 'VIRTUAL_ACCOUNT';
    reusability: XenditReusability;
    virtualAccount: {
        channelCode: XenditBankCode;
        channelProperties: {
            customerName: string;
            expiresAt: string;
        };
    };
}

export interface IXenditQrCodeParam {
    type: 'QR_CODE';
    reusability: XenditReusability;
    qrCode: {
        channelCode: 'QRIS';
        channelProperties: {
            expiresAt: string;
        };
    };
}

export interface IXenditEwalletParam {
    type: 'EWALLET';
    reusability: XenditReusability;
    ewallet: {
        channelCode: XenditEwalletChannelCode;
        channelProperties: {
            successReturnUrl: string;
            failureReturnUrl?: string;
        };
    };
}

export type IXenditPaymentMethodParam = IXenditVirtualAccountParam | IXenditQrCodeParam | IXenditEwalletParam;
