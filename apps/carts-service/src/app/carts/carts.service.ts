import { CartResponseDto } from '@lumina/shared-dto';
import { IAddToCartRequest } from '@lumina/shared-interfaces';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from '../../core/database/entities/cart-items.entity';
import { CartEntity } from '../../core/database/entities/cart.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { RpcException } from '@nestjs/microservices';

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

    async addToCart(userId: string, data: IAddToCartRequest) {
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

            return updatedCart;
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
}
