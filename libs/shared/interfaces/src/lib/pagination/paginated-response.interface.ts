export interface IPaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface IPaginatedResponse<T> {
    data: T[];
    meta: IPaginationMeta;
}
