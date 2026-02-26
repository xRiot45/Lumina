import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerService } from '@lumina/shared-logger';
import {
    AddToCartDto,
    CartResponseDto,
    EnrichedCartItemResponseDto,
    PaginationDto,
    ProductResponseDto,
} from '@lumina/shared-dto';
import { firstValueFrom } from 'rxjs';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { ICartItemResponse, IPaginatedResponse } from '@lumina/shared-interfaces';

@Injectable()
export class CartsService {
    private readonly context = `[GATEWAY] ${CartsService.name}`;

    constructor(
        @Inject('CARTS_SERVICE') private readonly cartsClient: ClientProxy,
        @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
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

    async getCart(userId: string, query: PaginationDto): Promise<IPaginatedResponse<EnrichedCartItemResponseDto>> {
        this.logger.log({ message: 'Initiating cart retrieval', userId }, this.context);

        try {
            const response = await firstValueFrom<IPaginatedResponse<ICartItemResponse>>(
                this.cartsClient.send({ cmd: 'get_cart' }, { userId, query }),
            );

            if (!response || !response.data || response.data.length === 0) {
                return {
                    data: [],
                    meta: response?.meta ?? {
                        page: 1,
                        limit: 10,
                        totalItems: 0,
                        totalPages: 0,
                    },
                };
            }

            const items = response.data;
            const uniqueProductIds: string[] = [...new Set(items.map((item) => item.productId))];

            const productsMap = new Map<string, ProductResponseDto>();

            await Promise.all(
                uniqueProductIds.map(async (pId: string) => {
                    try {
                        const productDetail = await firstValueFrom<{ data?: ProductResponseDto } | ProductResponseDto>(
                            this.productsClient.send({ cmd: 'find_product_by_id' }, { id: pId }),
                        );

                        const productData =
                            'data' in productDetail && productDetail.data
                                ? productDetail.data
                                : (productDetail as ProductResponseDto);

                        productsMap.set(pId, productData);
                    } catch {
                        this.logger.warn(`Failed to fetch product detail for ID: ${pId}`);
                    }
                }),
            );

            const enrichedItems = items.map((item) => {
                const product = productsMap.get(item.productId);
                const variant = product?.variants?.find((v) => v.id === item.variantId);

                const basePriceProduct = Number(product?.basePrice) || 0;
                const variantPriceProduct = Number(variant?.price) || 0;

                const currentPrice = basePriceProduct + variantPriceProduct;
                const subTotal = currentPrice * Number(item.quantity);

                return {
                    id: item.id,
                    cartId: item.cartId,
                    quantity: item.quantity,
                    subTotal: subTotal,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    product: product
                        ? {
                              id: product.id,
                              name: product.name,
                              slug: product.slug,
                              image: product.image,
                              basePrice: product.basePrice,
                          }
                        : null,
                    variant: variant
                        ? {
                              id: variant.id,
                              sku: variant.sku,
                              price: variant.price,
                              stock: variant.stock,
                          }
                        : null,
                };
            });

            return {
                data: enrichedItems.map((item) => mapToDto(EnrichedCartItemResponseDto, item)),
                meta: response.meta,
            };
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
}
