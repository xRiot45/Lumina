import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { LoggerModule } from '@lumina/shared-logger';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
