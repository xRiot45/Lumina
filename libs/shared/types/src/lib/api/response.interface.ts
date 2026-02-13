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
}

export interface IMicroserviceErrorPayload {
    success: boolean;
    statusCode?: number;
    status?: number;
    message?: string | string[];
    error?: string;
}
