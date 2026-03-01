import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../../core/database/entities/cart.entity';
import { CartItemEntity } from '../../core/database/entities/cart-items.entity';
import { LoggerModule } from '@lumina/shared-logger';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        TypeOrmModule.forFeature([CartEntity, CartItemEntity]),
        LoggerModule,
        ClientsModule.register([
            {
                name: 'PRODUCTS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.PRODUCTS_SERVICE_HOST,
                    port: Number(process.env.PRODUCTS_SERVICE_PORT),
                },
            },
        ]),
    ],
    controllers: [CartsController],
    providers: [CartsService],
})
export class CartsModule {}
