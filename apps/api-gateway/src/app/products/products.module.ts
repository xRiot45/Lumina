import { LoggerModule } from '@lumina/shared-logger';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [
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
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
