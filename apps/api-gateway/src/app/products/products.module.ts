import { LoggerModule } from '@lumina/shared-logger';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getMicroserviceConfig, MICROSERVICES } from '@lumina/shared-common';

@Module({
    imports: [LoggerModule, ClientsModule.register([getMicroserviceConfig(MICROSERVICES.PRODUCTS)])],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
