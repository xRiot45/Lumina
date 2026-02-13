import { IErrorResponse, IMicroserviceErrorPayload } from '@lumina/shared-types';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        console.log('🔥 RAW EXCEPTION:', JSON.stringify(exception, null, 2));

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';
        let errorType: string | undefined = 'Internal Server Error';

        // ----------------------------------------------------------------
        // CASE 1: Handle HTTP Exception (Standard NestJS Errors)
        // ----------------------------------------------------------------
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            // Type Narrowing untuk response body
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const payload = exceptionResponse as IMicroserviceErrorPayload;
                message = payload.message || exception.message;
                errorType = payload.error || 'HttpException';
            } else {
                message = exception.message;
            }
        }

        // ----------------------------------------------------------------
        // CASE 2: Handle RPC Exception (Errors from Microservices via TCP)
        // ----------------------------------------------------------------
        else if (exception instanceof RpcException) {
            const errorPayload = exception.getError();

            if (typeof errorPayload === 'object' && errorPayload !== null) {
                const payload = errorPayload as IMicroserviceErrorPayload;

                status = payload.statusCode || payload.status || HttpStatus.INTERNAL_SERVER_ERROR;
                message = payload.message || 'Microservice Error';
                errorType = payload.error || 'RpcException';
            } else if (typeof errorPayload === 'string') {
                message = errorPayload;
            }
        }

        // ----------------------------------------------------------------
        // CASE 3: Handle Generic JavaScript Error
        // ----------------------------------------------------------------
        else if (exception instanceof Error) {
            this.logger.error(`Unexpected Error: ${exception.message}`, exception.stack);
            message = exception.message;
        }

        // ----------------------------------------------------------------
        // SAFETY CHECK: Pastikan status code valid (Range HTTP 100-599)
        // ----------------------------------------------------------------
        if (status < 100 || status > 599) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        // ----------------------------------------------------------------
        // FINAL RESPONSE CONSTRUCTION
        // ----------------------------------------------------------------
        const errorResponse: IErrorResponse = {
            statusCode: status,
            message: message,
            error: errorType,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        response.status(status).json(errorResponse);
    }
}
