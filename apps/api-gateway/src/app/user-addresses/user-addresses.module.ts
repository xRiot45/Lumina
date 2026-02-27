import { Module } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { UserAddressesController } from './user-addresses.controller';
import { LoggerModule } from '@lumina/shared-logger';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        LoggerModule,
        ClientsModule.register([
            {
                name: 'USERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.USERS_SERVICE_HOST,
                    port: Number(process.env.USERS_SERVICE_PORT),
                },
            },
        ]),
    ],
    controllers: [UserAddressesController],
    providers: [UserAddressesService],
})
export class UserAddressesModule {}
