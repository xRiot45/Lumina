import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerService } from '@lumina/shared-logger';
import { AddToCartDto, CartResponseDto } from '@lumina/shared-dto';
import { firstValueFrom } from 'rxjs';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';

@Injectable()
export class CartsService {
    private readonly context = `[GATEWAY] ${CartsService.name}`;

    constructor(
        @Inject('CARTS_SERVICE') private readonly cartsClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async addToCart(userId: string, dto: AddToCartDto): Promise<CartResponseDto> {
        this.logger.log({ message: 'Initiating cart creation', userId }, this.context);

        try {
            const payload = {
                userId: userId,
                data: dto,
            };

            const response = await firstValueFrom(this.cartsClient.send({ cmd: 'add_to_cart' }, payload));
            return mapToDto(CartResponseDto, response);
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
