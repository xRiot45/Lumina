import { LoggerModule } from '@lumina/shared-logger';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { getMicroserviceConfig, MICROSERVICES } from '@lumina/shared-common';

@Module({
    imports: [
        PassportModule,
        LoggerModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                signOptions: {
                    expiresIn: configService.get<number>('JWT_ACCESS_EXPIRES_IN'),
                },
            }),
            inject: [ConfigService],
        }),
        ClientsModule.register([getMicroserviceConfig(MICROSERVICES.AUTH)]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ConfigService],
})
export class AuthModule {}
