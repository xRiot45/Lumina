import { mapToDto } from '@lumina/shared-utils';
import { ICartItemResponse, IPaginatedResponse, IPaginationQuery } from '@lumina/shared-interfaces';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from '../../core/database/entities/cart-items.entity';
import { CartEntity } from '../../core/database/entities/cart.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { RpcException } from '@nestjs/microservices';
import { AddToCartDto, CartResponseDto } from '@lumina/shared-dto';

@Injectable()
export class CartsService {
    private readonly context = `[SERVICE] ${CartsService.name}`;

    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        @InjectRepository(CartItemEntity)
        private readonly cartItemRepository: Repository<CartItemEntity>,
        private readonly logger: LoggerService,
    ) {}

    async addToCart(userId: string, data: AddToCartDto): Promise<CartResponseDto> {
        this.logger.log({ message: 'Initiating add to cart', data }, this.context);

        try {
            let cart = await this.cartRepository.findOne({
                where: { userId },
                relations: ['items'],
            });

            if (!cart) {
                this.logger.log({ message: 'Cart not found, creating new cart', userId }, this.context);
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
                this.logger.log(
                    { message: 'Updated existing cart item quantity', itemId: existingItem.id },
                    this.context,
                );
            } else {
                const newItem = this.cartItemRepository.create({
                    cart: cart,
                    productId: data.productId,
                    variantId: data.variantId,
                    quantity: data.quantity,
                });

                await this.cartItemRepository.save(newItem);
                cart.items.push(newItem);
                this.logger.log({ message: 'Added new item to cart', cartId: cart.id }, this.context);
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

            this.logger.error({ message: 'Failed to add item to cart', error: errorMessage }, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while adding the item to the cart',
                error: 'Internal Server Error',
            });
        }
    }

    async getCart(userId: string, query: IPaginationQuery): Promise<IPaginatedResponse<ICartItemResponse>> {
        this.logger.log({ message: 'Fetching cart for user', userId }, this.context);

        try {
            const page: number = Number(query?.page) || 1;
            const limit: number = Number(query?.limit) || 10;
            const skip: number = (page - 1) * limit;

            const cart: CartEntity | null = await this.cartRepository.findOne({
                where: { userId },
            });

            if (!cart) {
                this.logger.log({ message: 'Cart not found, returning empty state', userId }, this.context);
                return {
                    data: [],
                    meta: {
                        page,
                        limit,
                        totalItems: 0,
                        totalPages: 0,
                    },
                };
            }

            const [items, totalItems] = await this.cartItemRepository.findAndCount({
                where: { cartId: cart.id },
                skip: skip,
                take: limit,
                order: { createdAt: 'DESC' },
            });

            const totalPages: number = Math.ceil(totalItems / limit);
            const result: IPaginatedResponse<ICartItemResponse> = {
                data: items,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                },
            };

            this.logger.log({ message: 'Cart fetched successfully', userId }, this.context);
            return result;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to fetch cart', error: errorMessage }, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while fetching the cart',
                error: 'Internal Server Error',
            });
        }
    }

    async deleteItemFromCart(userId: string, cartItemId: string): Promise<{ success: boolean }> {
        this.logger.log({ message: 'Deleting cart item', userId, cartItemId }, this.context);

        try {
            const cartItem = await this.cartItemRepository.findOne({
                where: { id: cartItemId },
                relations: ['cart'],
            });

            if (!cartItem || cartItem.cart?.userId !== userId) {
                this.logger.warn({ message: 'Cart Item not found or unauthorized', userId, cartItemId }, this.context);
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
                this.logger.log({ message: 'Cart is empty, deleting parent cart', cartId }, this.context);
                await this.cartRepository.delete(cartId);
            }

            this.logger.log({ message: 'Cart item deleted successfully', userId, cartItemId }, this.context);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Failed to remove item from cart', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while removing the item from the cart',
                error: 'Internal Server Error',
            });
        }
    }

    async deleteCart(userId: string, cartId: string): Promise<{ success: boolean }> {
        this.logger.log({ message: 'Deleting cart', userId, cartId }, this.context);

        try {
            const cart = await this.cartRepository.findOne({
                where: { id: cartId },
            });

            if (!cart || cart.userId !== userId) {
                this.logger.warn({ message: 'Cart not found or unauthorized', userId, cartId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Cart not found',
                    error: 'Not Found',
                });
            }

            await this.cartRepository.delete(cartId);

            this.logger.log({ message: 'Cart deleted successfully', userId, cartId }, this.context);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Failed to remove item from cart', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while removing the item from the cart',
                error: 'Internal Server Error',
            });
        }
    }

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<{ success: boolean }> {
        this.logger.log({ message: 'Updating cart item quantity', userId, cartItemId, quantity }, this.context);

        try {
            const cartItem = await this.cartItemRepository.findOne({
                where: { id: cartItemId },
                relations: ['cart'],
            });

            if (!cartItem || cartItem.cart?.userId !== userId) {
                this.logger.warn({ message: 'Cart Item not found or unauthorized', userId, cartItemId }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Cart item not found',
                    error: 'Not Found',
                });
            }

            cartItem.quantity = quantity;
            await this.cartItemRepository.save(cartItem);

            this.logger.log({ message: 'Cart item quantity updated successfully', userId, cartItemId }, this.context);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Failed to remove item from cart', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while removing the item from the cart',
                error: 'Internal Server Error',
            });
        }
    }
}
