import { ResponseInterceptor } from '@lumina/shared-common';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Global()
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    // host: '0.0.0.0',
                    port: 3001,
                },
            },
            {
                name: 'USERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    // host: '0.0.0.0',
                    port: 3002,
                },
            },
            {
                name: 'PRODUCTS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    // host: '0.0.0.0',
                    port: 3003,
                },
            },
        ]),
        AuthModule,
        ProductsModule,
    ],
    providers: [ResponseInterceptor],
})
export class AppModule {}
