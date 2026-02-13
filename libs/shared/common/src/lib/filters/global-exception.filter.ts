import { IErrorResponse } from '@lumina/shared-types';
import { isMicroserviceError, isNestedErrorPayload } from '@lumina/shared-utils';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';
        let errorType: string | undefined = 'Internal Server Error';

        const stackTrace = exception instanceof Error ? exception.stack : undefined;

        // Handle HTTP Exception (Standard NestJS)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();

            if (isMicroserviceError(res)) {
                message = res.message || exception.message;
                errorType = res.error || 'HttpException';
            } else {
                message = exception.message;
            }
        }

        // Handle RpcException
        else if (exception instanceof RpcException) {
            const errorPayload = exception.getError();

            if (isMicroserviceError(errorPayload)) {
                status = errorPayload.statusCode || errorPayload.status || HttpStatus.INTERNAL_SERVER_ERROR;
                message = errorPayload.message || 'Microservice Error';
                errorType = errorPayload.error || 'RpcException';
            } else if (typeof errorPayload === 'string') {
                message = errorPayload;
            }
        }

        //  Handle "Serialized Error"
        else if (isMicroserviceError(exception)) {
            status = exception.statusCode || exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message || 'Microservice Error';
            errorType = exception.error || 'RpcException';
        }

        // Handle Nested Error
        else if (isNestedErrorPayload(exception)) {
            const nested = exception.error;
            status = nested.statusCode || nested.status || HttpStatus.INTERNAL_SERVER_ERROR;
            message = nested.message || 'Nested Error';
            errorType = nested.error || 'RpcException';
        }

        // Handle Generic JavaScript Error
        else if (exception instanceof Error) {
            message = exception.message;
        }

        if (typeof status !== 'number' || status < 100 || status > 599) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        if (status >= 500) {
            this.logger.error(
                `[${request.method}] ${request.url} - Status: ${status}`,
                stackTrace || JSON.stringify(exception),
            );
        }

        const errorResponse: IErrorResponse = {
            statusCode: status,
            message: message,
            error: errorType,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        if (process.env.NODE_ENV !== 'production') {
            errorResponse.stack = stackTrace;
        }

        response.status(status).json(errorResponse);
    }
}
