export interface IXenditWebhookData {
    id?: string;
    reference_id?: string;
    payment_request_id?: string;
}

export interface IXenditWebhook {
    event: string;
    id?: string;
    external_id?: string;
    reference_id?: string;
    payment_request_id?: string;
    data?: IXenditWebhookData;
}

export interface IXenditWebhookPayload {
    callbackToken: string;
    data: IXenditWebhook;
}
