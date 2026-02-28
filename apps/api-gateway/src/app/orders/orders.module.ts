import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@lumina/shared-logger';

@Module({
    imports: [
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
                name: 'ORDERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.ORDERS_SERVICE_HOST,
                    port: Number(process.env.ORDERS_SERVICE_PORT),
                },
            },
        ]),
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
