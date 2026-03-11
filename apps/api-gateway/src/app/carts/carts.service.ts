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
import { CARTS_COMMAND_PATTERN, MICROSERVICES } from '@lumina/shared-common';

@Injectable()
export class CartsService {
    constructor(
        @Inject(MICROSERVICES.CARTS) private readonly cartsClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async addToCart(userId: string, dto: AddToCartDto): Promise<CartResponseDto> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.addToCart.name}`;
        this.logger.log({ message: 'Initiating cart creation', userId }, context);

        try {
            const payload: AddToCartPayloadDto = {
                userId: userId,
                data: dto,
            };

            const response = await firstValueFrom(this.cartsClient.send(CARTS_COMMAND_PATTERN.ADD_TO_CART, payload));
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
        const context = `[GATEWAY] ${this.constructor.name} : ${this.getCart.name}`;
        this.logger.log({ message: 'Initiating cart retrieval proxy', userId }, context);

        try {
            const response = await firstValueFrom(
                this.cartsClient.send(CARTS_COMMAND_PATTERN.GET_CART, { userId, query }),
            );
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
        const context = `[GATEWAY] ${this.constructor.name} : ${this.deleteItemFromCart.name}`;
        this.logger.log({ message: 'Deleting item from cart', userId, cartItemId }, context);

        try {
            const response = await firstValueFrom(
                this.cartsClient.send(CARTS_COMMAND_PATTERN.DELETE_ITEM_FROM_CART, { userId, cartItemId }),
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
        const context = `[GATEWAY] ${this.constructor.name} : ${this.deleteCart.name}`;
        this.logger.log({ message: 'Deleting cart', userId, cartId }, context);

        try {
            const response = await firstValueFrom(
                this.cartsClient.send(CARTS_COMMAND_PATTERN.DELETE_CART, { userId, cartId }),
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

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<void> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.updateItemQuantity.name}`;
        this.logger.log({ message: 'Updating cart item quantity', userId, cartItemId, quantity }, context);

        try {
            const payload: IUpdateCartItemPayload = { userId, cartItemId, quantity };
            const response = await firstValueFrom(
                this.cartsClient.send(CARTS_COMMAND_PATTERN.UPDATE_ITEM_QUANTITY, payload),
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
}
