import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../../core/database/entities/cart.entity';
import { CartItemEntity } from '../../core/database/entities/cart-items.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity])],
    controllers: [CartsController],
    providers: [CartsService],
})
export class CartsModule {}
