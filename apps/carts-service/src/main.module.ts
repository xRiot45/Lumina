import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { CartsModule } from './app/carts/carts.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        CartsModule,
    ],
    providers: [],
})
export class MainModule {}
