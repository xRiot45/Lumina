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
                    host: 'localhost',
                    port: 3003,
                },
            },
        ]),
    ],
    controllers: [ProductCategoriesController],
    providers: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
