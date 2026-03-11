import { mapToDto } from '@lumina/shared-utils';
import { IPaginatedResponse, IPaginationQuery } from '@lumina/shared-interfaces';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from '../../core/database/entities/cart-items.entity';
import { CartEntity } from '../../core/database/entities/cart.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AddToCartDto, CartResponseDto, EnrichedCartItemResponseDto, ProductResponseDto } from '@lumina/shared-dto';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES } from '@lumina/shared-common';

@Injectable()
export class CartsService {
    constructor(
        @Inject(MICROSERVICES.PRODUCTS) private readonly productsClient: ClientProxy,
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,
        private readonly logger: LoggerService,
    ) {}

    async addToCart(userId: string, data: AddToCartDto): Promise<CartResponseDto> {
        const context = `[SERVICE] ${this.constructor.name} : ${this.addToCart.name}`;
        this.logger.log({ message: 'Initiating add to cart', data }, context);

        try {
            let cart = await this.cartRepository.findOne({
                where: { userId },
                relations: ['items'],
            });

            if (!cart) {
                this.logger.log({ message: 'Cart not found, creating new cart', userId }, context);
                cart = this.cartRepository.create({ userId });
                await this.cartRepository.save(cart);
                cart.items = [];
            }

            const existingItemIndex = cart.items.findIndex(
                (item) => item?.productId === data?.productId && item?.variantId === data?.variantId,
            );

            if (existingItemIndex > -1) {
                const existingItem = cart.items[existingItemIndex];
                existingItem.quantity += data.quantity;

                await this.cartItemRepository.save(existingItem);
                this.logger.log({ message: 'Updated existing cart item quantity', itemId: existingItem.id }, context);
            } else {
                const newItem = this.cartItemRepository.create({
                    cart: cart,
                    productId: data.productId,
                    variantId: data.variantId,
                    quantity: data.quantity,
                });

                await this.cartItemRepository.save(newItem);
                cart.items.push(newItem);
                this.logger.log({ message: 'Added new item to cart', cartId: cart.id }, context);
            }

            const updatedCart = await this.cartRepository.findOne({
                where: { id: cart.id },
                relations: ['items'],
            });

            return mapToDto(CartResponseDto, updatedCart);
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to add item to cart', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while adding the item to the cart',
                error: 'Internal Server Error',
            });
        }
    }

    async getCart(userId: string, query: IPaginationQuery): Promise<IPaginatedResponse<EnrichedCartItemResponseDto>> {
        const context = `[SERVICE] ${this.constructor.name} : ${this.getCart.name}`;
        this.logger.log({ message: 'Fetching cart and enriching data for user', userId }, context);

        try {
            const page: number = Number(query?.page) || 1;
            const limit: number = Number(query?.limit) || 10;
            const skip: number = (page - 1) * limit;

            const emptyResponse = {
                data: [],
                meta: { page, limit, totalItems: 0, totalPages: 0 },
            };

            const cart = await this.cartRepository.findOne({ where: { userId } });
            if (!cart) {
                this.logger.log({ message: 'Cart not found, returning empty state', userId }, context);
                return emptyResponse;
            }

            const [items, totalItems] = await this.cartItemRepository.findAndCount({
                where: { cartId: cart.id },
                skip: skip,
                take: limit,
                order: { createdAt: 'DESC' },
            });

            if (items.length === 0) {
                return emptyResponse;
            }

            const uniqueProductIds: string[] = [...new Set(items.map((item) => item.productId))];
            const productsMap = new Map<string, ProductResponseDto>();

            await Promise.all(
                uniqueProductIds.map(async (productId: string) => {
                    try {
                        const productDetail = await firstValueFrom<{ data?: ProductResponseDto } | ProductResponseDto>(
                            this.productsClient.send({ cmd: 'find_product_by_id' }, productId),
                        );

                        const productData =
                            productDetail && 'data' in productDetail && productDetail.data
                                ? productDetail.data
                                : productDetail;

                        if (productData) {
                            productsMap.set(productId, productData as ProductResponseDto);
                        } else {
                            this.logger.warn(`Product API returned empty for ID: ${productId}`, context);
                        }
                    } catch {
                        this.logger.warn(`Failed to fetch product detail for ID: ${productId}`, context);
                    }
                }),
            );

            const enrichedItems = items.map((item) => {
                const product = productsMap.get(item.productId);
                const variant = product?.variants?.find((v) => v.id === item.variantId);

                let unitPrice = Number(product?.basePrice) || 0;
                if (variant) {
                    unitPrice = Number(variant.price);
                }

                const subTotal = unitPrice * Number(item.quantity);

                return {
                    id: item.id,
                    cartId: item.cartId,
                    quantity: item.quantity,
                    unitPrice: unitPrice,
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

            const totalPages: number = Math.ceil(totalItems / limit);

            const formattedData = enrichedItems.map((item) => mapToDto(EnrichedCartItemResponseDto, item));

            const result: IPaginatedResponse<EnrichedCartItemResponseDto> = {
                data: formattedData,
                meta: { page, limit, totalItems, totalPages },
            };

            this.logger.log({ message: 'Cart enriched successfully', userId }, context);
            return result;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to fetch cart', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while fetching the cart',
                error: 'Internal Server Error',
            });
        }
    }

    async deleteItemFromCart(userId: string, cartItemId: string): Promise<{ success: boolean }> {
        const context = `[SERVICE] ${this.constructor.name} : ${this.deleteItemFromCart.name}`;
        this.logger.log({ message: 'Deleting cart item', userId, cartItemId }, context);

        try {
            const cartItem = await this.cartItemRepository.findOne({
                where: { id: cartItemId },
                relations: ['cart'],
            });

            if (!cartItem || cartItem.cart?.userId !== userId) {
                this.logger.warn({ message: 'Cart Item not found or unauthorized', userId, cartItemId }, context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Cart item not found',
                    error: 'Not Found',
                });
            }

            const cartId = cartItem.cart.id;

            await this.cartItemRepository.delete(cartItemId);

            const remainingItemsCount = await this.cartItemRepository.count({
                where: { cartId: cartId },
            });

            if (remainingItemsCount === 0) {
                this.logger.log({ message: 'Cart is empty, deleting parent cart', cartId }, context);
                await this.cartRepository.delete(cartId);
            }

            this.logger.log({ message: 'Cart item deleted successfully', userId, cartItemId }, context);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to remove item from cart', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while removing the item from the cart',
                error: 'Internal Server Error',
            });
        }
    }

    async deleteCart(userId: string, cartId: string): Promise<{ success: boolean }> {
        const context = `[SERVICE] ${this.constructor.name} : ${this.deleteCart.name}`;
        this.logger.log({ message: 'Deleting cart', userId, cartId }, context);

        try {
            const cart = await this.cartRepository.findOne({
                where: { id: cartId },
            });

            if (!cart || cart.userId !== userId) {
                this.logger.warn({ message: 'Cart not found or unauthorized', userId, cartId }, context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Cart not found',
                    error: 'Not Found',
                });
            }

            await this.cartRepository.delete(cartId);

            this.logger.log({ message: 'Cart deleted successfully', userId, cartId }, context);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to remove item from cart', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while removing the item from the cart',
                error: 'Internal Server Error',
            });
        }
    }

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<{ success: boolean }> {
        const context = `[SERVICE] ${this.constructor.name} : ${this.updateItemQuantity.name}`;
        this.logger.log({ message: 'Updating cart item quantity', userId, cartItemId, quantity }, context);

        try {
            const cartItem = await this.cartItemRepository.findOne({
                where: { id: cartItemId },
                relations: ['cart'],
            });

            if (!cartItem || cartItem.cart?.userId !== userId) {
                this.logger.warn({ message: 'Cart Item not found or unauthorized', userId, cartItemId }, context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Cart item not found',
                    error: 'Not Found',
                });
            }

            cartItem.quantity = quantity;
            await this.cartItemRepository.save(cartItem);

            this.logger.log({ message: 'Cart item quantity updated successfully', userId, cartItemId }, context);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to remove item from cart', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while removing the item from the cart',
                error: 'Internal Server Error',
            });
        }
    }
}
