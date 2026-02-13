import { GlobalExceptionFilter } from '@lumina/shared-common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const env = process.env.NODE_ENV || 'development';
    const port = process.env.PORT || 3000;
    const globalPrefix = 'api';

    try {
        app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    } catch (e) {
        Logger.warn('Winston logger not found, falling back to default logger', e);
    }

    app.setGlobalPrefix(globalPrefix);
    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: env === 'production',
        }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());
    if (env === 'production') {
        app.enableCors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://lumina.com',
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        });
    } else {
        app.enableCors({
            origin: true,
            credentials: true,
        });
    }

    if (env !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Lumina API Gateway')
            .setDescription('The Lumina Microservices API description')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
        Logger.log(`📚 Swagger Docs enabled: http://localhost:${port}/docs`);
    }

    await app.listen(port);
    Logger.log(`🚀 API Gateway is running in [${env.toUpperCase()}] mode on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
