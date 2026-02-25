import { LoggerModule } from '@lumina/shared-logger';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductCategoriesController } from './product_categories.controller';
import { ProductCategoriesService } from './product_categories.service';

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
    controllers: [ProductCategoriesController],
    providers: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
