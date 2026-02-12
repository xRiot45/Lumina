import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './app/auth.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
        transport: Transport.TCP,
        options: {
            host: process.env.HOST || 'localhost',
            port: parseInt(process.env.PORT ?? '3001', 10),
        },
    });

    await app.listen();
    Logger.log('Auth service is listening on port 3001');
}

bootstrap();
