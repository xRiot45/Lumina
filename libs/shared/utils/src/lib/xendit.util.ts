import { PaymentMethod, XenditBankCode } from '@lumina/shared-interfaces';

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
        case PaymentMethod.PERMATA_VA:
            return 'PERMATA';
        case PaymentMethod.CIMB_VA:
            return 'CIMB';
        case PaymentMethod.BSI_VA:
            return 'BSI';
        case PaymentMethod.BJB_VA:
            return 'BJB';
        case PaymentMethod.SAHABAT_SAMPOERNA_VA:
            return 'SAHABAT_SAMPOERNA';
        default:
            return 'BCA';
    }
}
