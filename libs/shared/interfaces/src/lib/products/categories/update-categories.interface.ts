export interface IUpdateProductCategories {
    name: string;
}

export interface IUpdateProductCategoryPayload {
    id: string;
    data: IUpdateProductCategories;
}
