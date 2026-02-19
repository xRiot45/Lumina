export interface IUpdateProductCategory {
    name: string;
}

export interface IUpdateProductCategoryPayload {
    id: string;
    data: IUpdateProductCategory;
}
