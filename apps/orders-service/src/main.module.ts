import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { OrdersModule } from './app/orders/orders.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        OrdersModule,
    ],
    providers: [],
})
export class MainModule {}
