export interface IPaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface IPaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    order?: 'ASC' | 'DESC';
}

export interface IPaginatedResponse<T> {
    data: T[];
    meta: IPaginationMeta;
}
