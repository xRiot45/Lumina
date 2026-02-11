import { ApiResponse } from '@lumina/shared-types';

export function isCustomFormattedResponse<T>(
    data: T | Partial<ApiResponse<unknown>> | undefined | null,
): data is Partial<ApiResponse<T>> {
    return typeof data === 'object' && data !== null && 'success' in data;
}
