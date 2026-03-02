import { LoggerModule } from '@lumina/shared-logger';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
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
        ]),
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {}
