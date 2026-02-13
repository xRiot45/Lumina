import { IApiResponse } from '@lumina/shared-types';
import { isCustomFormattedResponse } from '@lumina/shared-utils';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;

        return next.handle().pipe(
            map((data: T | Partial<IApiResponse<T>> | undefined | null): IApiResponse<T> => {
                if (typeof data === 'object' && data !== null && 'data' in data && 'meta' in data && 'links' in data) {
                    return {
                        success: true,
                        statusCode,
                        timestamp: new Date().toISOString(),
                        ...data,
                    } as IApiResponse<T>;
                }

                if (isCustomFormattedResponse(data)) {
                    return {
                        ...data,
                        statusCode: statusCode,
                        timestamp: new Date().toISOString(),
                    } as IApiResponse<T>;
                }

                if (data === undefined || data === null) {
                    return {
                        success: true,
                        statusCode: statusCode,
                        timestamp: new Date().toISOString(),
                        message: 'Operation successful (no content)',
                        data: null as T,
                    };
                }

                return {
                    success: true,
                    statusCode: statusCode,
                    timestamp: new Date().toISOString(),
                    message: 'Operation successful',
                    data: data as T,
                };
            }),
        );
    }
}
