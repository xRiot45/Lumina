import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { PaymentsModule } from './app/payments/payments.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PaymentsModule,
    ],
    providers: [],
})
export class MainModule {}
