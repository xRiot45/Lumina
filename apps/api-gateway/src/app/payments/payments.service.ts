import {
    ChargePaymentDto,
    ChargePaymentPayloadDto,
    ChargePaymentResponseDto,
    GetPaymentInfoPaylaodDto,
    GetPaymentInfoResponseDto,
} from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
    private readonly context = `[GATEWAY] ${PaymentsService.name}`;

    constructor(
        @Inject('PAYMENTS_SERVICE') private readonly paymentsClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async chargePayment(userId: string, dto: ChargePaymentDto): Promise<ChargePaymentResponseDto> {
        this.logger.log({ message: 'Starting checkout proxy process for userId', userId }, this.context);

        try {
            const payload: ChargePaymentPayloadDto = {
                userId,
                data: dto,
            };

            const response = await firstValueFrom(this.paymentsClient.send({ cmd: 'charge_payment' }, payload));
            this.logger.log({ message: 'Payment charge successful', orderId: dto.orderId }, this.context);

            return mapToDto(ChargePaymentResponseDto, response);
        } catch (error: unknown) {
            this.logger.error(`[Gateway] Raw Error from Payments Microservice: ${JSON.stringify(error)}`);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException(
                    {
                        statusCode: status,
                        message: message,
                        error: errorName,
                    },
                    status,
                );
            }

            if (error instanceof Error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: error.message,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Unknown Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getPaymentInfo(userId: string, orderId: string): Promise<GetPaymentInfoResponseDto> {
        this.logger.log({ message: 'Starting checkout proxy process for userId', userId }, this.context);

        try {
            const payload: GetPaymentInfoPaylaodDto = {
                userId,
                orderId,
            };
            const response = await firstValueFrom(this.paymentsClient.send({ cmd: 'get_payment_info' }, payload));

            return mapToDto(GetPaymentInfoResponseDto, response);
        } catch (error: unknown) {
            this.logger.error(`[Gateway] Raw Error from Payments Microservice: ${JSON.stringify(error)}`);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException(
                    {
                        statusCode: status,
                        message: message,
                        error: errorName,
                    },
                    status,
                );
            }

            if (error instanceof Error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: error.message,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Unknown Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
