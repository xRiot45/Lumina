import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerService } from '@lumina/shared-logger';
import {
    AddToCartDto,
    AddToCartPayloadDto,
    CartResponseDto,
    EnrichedCartItemResponseDto,
    PaginationDto,
} from '@lumina/shared-dto';
import { firstValueFrom } from 'rxjs';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { IPaginatedResponse, IUpdateCartItemPayload } from '@lumina/shared-interfaces';

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
            const payload: AddToCartPayloadDto = {
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

    async getCart(userId: string, query: PaginationDto): Promise<IPaginatedResponse<EnrichedCartItemResponseDto>> {
        this.logger.log({ message: 'Initiating cart retrieval proxy', userId }, this.context);

        try {
            const response = await firstValueFrom(this.cartsClient.send({ cmd: 'get_cart' }, { userId, query }));
            this.logger.log({ message: 'Cart retrieved successfully from microservice', userId }, this.context);

            return response;
        } catch (error: unknown) {
            this.logger.error(`[Gateway] Raw Error from Carts Microservice: ${JSON.stringify(error)}`);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException({ statusCode: status, message: message, error: errorName }, status);
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

    async deleteItemFromCart(userId: string, cartItemId: string): Promise<void> {
        this.logger.log({ message: 'Deleting item from cart', userId, cartItemId }, this.context);

        try {
            const response = await firstValueFrom(
                this.cartsClient.send({ cmd: 'delete_item_from_cart' }, { userId, cartItemId }),
            );
            return response;
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

    async deleteCart(userId: string, cartId: string): Promise<void> {
        this.logger.log({ message: 'Deleting cart', userId, cartId }, this.context);

        try {
            const response = await firstValueFrom(this.cartsClient.send({ cmd: 'delete_cart' }, { userId, cartId }));
            return response;
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

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<void> {
        this.logger.log({ message: 'Updating cart item quantity', userId, cartItemId, quantity }, this.context);

        try {
            const payload: IUpdateCartItemPayload = { userId, cartItemId, quantity };
            const response = await firstValueFrom(this.cartsClient.send({ cmd: 'update_item_quantity' }, payload));
            return response;
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
