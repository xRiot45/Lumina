import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.TCP,
        options: {
            host: process.env.HOST || 'localhost',
            port: parseInt(process.env.PORT ?? '3002', 10),
        },
    });

    await app.listen();
    console.log('Users service is listening on port 3002');
}

bootstrap();
