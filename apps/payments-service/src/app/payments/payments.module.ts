import { LoggerModule } from '@lumina/shared-logger';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        LoggerModule,
        ClientsModule.register([
            {
                name: 'ORDERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.ORDERS_SERVICE_HOST,
                    port: Number(process.env.ORDERS_SERVICE_PORT),
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
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {}
