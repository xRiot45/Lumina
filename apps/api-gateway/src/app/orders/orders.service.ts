import { CreateOrderDto, CreateOrderPayloadDto, OrderResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
    private readonly context = `[GATEWAY] ${OrdersService.name}`;

    constructor(
        @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async checkout(userId: string, dto: CreateOrderDto): Promise<OrderResponseDto> {
        this.logger.log({ message: 'Starting checkout proxy process for userId', userId }, this.context);

        try {
            const payload: CreateOrderPayloadDto = {
                userId,
                data: dto,
            };

            this.logger.log(`Forwarding order request to orders-service for userId: ${userId}`, this.context);

            const response = await firstValueFrom(this.ordersClient.send({ cmd: 'create_order' }, payload));
            this.logger.log({ message: 'Checkout successfully for userId: ' + userId }, this.context);

            return mapToDto(OrderResponseDto, response);
        } catch (error: unknown) {
            this.logger.error(`[Gateway] Raw Error from Carts Microservice: ${JSON.stringify(error)}`);

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
