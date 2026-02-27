import { LuminaServiceType } from '@lumina/shared-interfaces';

export function calculateShippingCost(serviceType: LuminaServiceType): number {
    switch (serviceType) {
        case LuminaServiceType.SAME_DAY:
            return 50000;

        case LuminaServiceType.NEXT_DAY:
            return 25000;

        case LuminaServiceType.STANDARD:
            return 15000;

        default:
            return 15000;
    }
}
