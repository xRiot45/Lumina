import { PaymentMethod, XenditBankCode, XenditEwalletChannelCode } from '@lumina/shared-interfaces';

export function getXenditBankCode(method: PaymentMethod): XenditBankCode {
    switch (method) {
        case PaymentMethod.BCA_VA:
            return 'BCA';
        case PaymentMethod.MANDIRI_VA:
            return 'MANDIRI';
        case PaymentMethod.BRIVA:
            return 'BRI';
        case PaymentMethod.BNI_VA:
            return 'BNI';
        case PaymentMethod.BJB_VA:
            return 'BJB';
        case PaymentMethod.BNC_VA:
            return 'BNC';
        case PaymentMethod.BSI_VA:
            return 'BSI';
        case PaymentMethod.BSS_VA:
            return 'BSS';
        case PaymentMethod.CIMB_VA:
            return 'CIMB';
        case PaymentMethod.MUAMALAT_VA:
            return 'MUAMALAT';
        case PaymentMethod.PERMATA_VA:
            return 'PERMATA';
        default:
            throw new Error(`Invalid or unsupported bank code mapping for method: ${method}`);
    }
}

export function getXenditEwalletCode(method: PaymentMethod): XenditEwalletChannelCode {
    switch (method) {
        case PaymentMethod.DANA:
            return 'DANA';
        case PaymentMethod.OVO:
            return 'OVO';
        case PaymentMethod.GOPAY:
            return 'GOPAY';
        case PaymentMethod.SHOPEEPAY:
            return 'SHOPEEPAY';
        case PaymentMethod.ASTRAPAY:
            return 'ASTRAPAY';
        case PaymentMethod.JENIUSPAY:
            return 'JENIUSPAY';
        case PaymentMethod.LINKAJA:
            return 'LINKAJA';
        case PaymentMethod.NEXCASH:
            return 'NEXCASH';
        default:
            throw new Error(`Invalid or unsupported ewallet code mapping for method: ${method}`);
    }
}
