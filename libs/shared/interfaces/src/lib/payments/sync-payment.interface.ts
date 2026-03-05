import { OrderStatus } from '../enums/order-status.enum';

export interface ISyncPaymentStatusResponse {
    status: OrderStatus;
    isChanged: boolean;
}
