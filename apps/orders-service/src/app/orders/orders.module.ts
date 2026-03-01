import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../core/database/entities/order.entity';
import { OrderItemEntity } from '../../core/database/entities/order-item.entity';
import { LoggerModule } from '@lumina/shared-logger';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
        LoggerModule,
        ClientsModule.register([
            {
                name: 'CARTS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.CARTS_SERVICE_HOST,
                    port: Number(process.env.CARTS_SERVICE_PORT),
                },
            },
            {
                name: 'USERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.USERS_SERVICE_HOST,
                    port: Number(process.env.USERS_SERVICE_PORT),
                },
            },
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
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
