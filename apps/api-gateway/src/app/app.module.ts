import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
