import { IApiResponse } from '@lumina/shared-types';

export function isCustomFormattedResponse<T>(
    data: T | Partial<IApiResponse<unknown>> | undefined | null,
): data is Partial<IApiResponse<T>> {
    return typeof data === 'object' && data !== null && 'success' in data;
}
