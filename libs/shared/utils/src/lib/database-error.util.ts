export interface IDatabaseError extends Error {
    code?: string;
    errno?: number;
}

export function isDatabaseError(error: unknown): error is IDatabaseError {
    return typeof error === 'object' && error !== null && ('code' in error || 'errno' in error);
}
