export interface IXenditWebhookData {
    id: string; // ID Payment Request (paymentGatewayId di databasemu)
    reference_id: string; // Biasanya ini adalah orderId kamu
    status: string; // 'SUCCEEDED', 'PENDING', 'FAILED', dll
    amount: number;
    currency: string;
    [key: string]: any;
}

export interface IXenditWebhookPayload {
    event: string; // Contoh: 'payment_request.succeeded'
    business_id: string;
    created: string;
    data: IXenditWebhookData;
}
