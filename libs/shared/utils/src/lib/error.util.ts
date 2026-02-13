import { IMicroserviceErrorResponse } from '@lumina/shared-types';

export function isMicroserviceError(obj: unknown): obj is IMicroserviceErrorResponse {
    return typeof obj === 'object' && obj !== null && ('statusCode' in obj || 'status' in obj || 'message' in obj);
}

export function isNestedErrorPayload(obj: unknown): obj is { error: IMicroserviceErrorResponse } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'error' in obj &&
        isMicroserviceError(
            (
                obj as {
                    error: IMicroserviceErrorResponse;
                }
            ).error,
        )
    );
}
