import { ResponseInterceptor } from '@lumina/shared-common';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';

@Global()
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
    providers: [ResponseInterceptor],
})
export class AppModule {}
