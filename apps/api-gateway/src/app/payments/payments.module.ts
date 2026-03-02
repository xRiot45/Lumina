import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from '@lumina/shared-logger';

@Module({
    imports: [
        LoggerModule,
        ClientsModule.register([
            {
                name: 'PAYMENTS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.PAYMENTS_SERVICE_HOST,
                    port: Number(process.env.PAYMENTS_SERVICE_PORT),
                },
            },
        ]),
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {}
