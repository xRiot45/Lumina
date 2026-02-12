import { LoggerModule } from '@lumina/shared-logger';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './app/users/users.module';
import { DatabaseModule } from './core/database/database.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60,
                limit: 1000,
            },
            {
                ttl: 3600,
                limit: 10000,
            },
            {
                ttl: 86400,
                limit: 100000,
            },
        ]),
        DatabaseModule,
        UsersModule,
        LoggerModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class MainModule {}
