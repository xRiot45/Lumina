import { ResponseInterceptor } from '@lumina/shared-common';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product_categories/product_categories.module';
import { CartsModule } from './carts/carts.module';
import { UserAddressesModule } from './user-addresses/user-addresses.module';

@Global()
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.AUTH_SERVICE_HOST,
                    port: Number(process.env.AUTH_SERVICE_PORT),
                },
            },
            {
                name: 'USERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.USERS_SERVICE_HOST,
                    port: Number(process.env.USERS_SERVICE_PORT),
                },
            },
            {
                name: 'PRODUCTS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.PRODUCTS_SERVICE_HOST,
                    port: Number(process.env.PRODUCTS_SERVICE_PORT),
                },
            },
            {
                name: 'CARTS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.CARTS_SERVICE_HOST,
                    port: Number(process.env.CARTS_SERVICE_PORT),
                },
            },
            {
                name: 'ORDERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: process.env.ORDERS_SERVICE_HOST,
                    port: Number(process.env.ORDERS_SERVICE_PORT),
                },
            },
        ]),
        AuthModule,
        ProductsModule,
        ProductCategoriesModule,
        CartsModule,
        UserAddressesModule,
    ],
    providers: [ResponseInterceptor],
})
export class AppModule {}
