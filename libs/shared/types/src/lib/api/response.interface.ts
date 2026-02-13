export interface IApiResponse<T> {
    success: boolean;
    statusCode: number;
    timestamp: string;
    data?: T;
    message?: string;
}

export interface IErrorResponse {
    statusCode: number;
    message: string | string[];
    error?: string;
    timestamp: string;
    path: string;
    stack?: string;
}

export interface IMicroserviceErrorResponse {
    success: boolean;
    statusCode?: number;
    status?: number;
    error?: string;
    message?: string | string[];
}
