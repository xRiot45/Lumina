import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './app/users/users.module';
import { DatabaseModule } from './core/database/database.module';
import { UserAddressesModule } from './app/user-addresses/user-addresses.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        UsersModule,
        UserAddressesModule,
    ],
    providers: [],
})
export class MainModule {}
