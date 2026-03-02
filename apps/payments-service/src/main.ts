import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MainModule } from './main.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(MainModule, {
        transport: Transport.TCP,
        options: {
            host: process.env.HOST || 'localhost',
            port: parseInt(process.env.PORT ?? '3006', 10),
        },
    });

    await app.listen();
    Logger.log('Payments service is listening on port 3006');
}

bootstrap();
