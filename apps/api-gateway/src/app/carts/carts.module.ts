import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { LoggerModule } from '@lumina/shared-logger';
import { ClientsModule } from '@nestjs/microservices';
import { getMicroserviceConfig, MICROSERVICES } from '@lumina/shared-common';

@Module({
    imports: [LoggerModule, ClientsModule.register([getMicroserviceConfig(MICROSERVICES.CARTS)])],
    controllers: [CartsController],
    providers: [CartsService],
})
export class CartsModule {}
