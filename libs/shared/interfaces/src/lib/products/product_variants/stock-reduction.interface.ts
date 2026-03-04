export interface IStockReductionItem {
    productId: string;
    variantId: string;
    quantity: number;
}

export interface IReduceStockEvent {
    orderId: string;
    items: IStockReductionItem[];
}
