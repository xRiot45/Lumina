import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: '0.0.0.0',
                    port: 3001,
                },
            },
            {
                name: 'USERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: '0.0.0.0',
                    port: 3002,
                },
            },
        ]),
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
