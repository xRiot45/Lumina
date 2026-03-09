import { ResponseInterceptor } from '@lumina/shared-common';
import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product_categories/product_categories.module';
import { CartsModule } from './carts/carts.module';
import { UserAddressesModule } from './user-addresses/user-addresses.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Global()
@Module({
    imports: [
        AuthModule,
        ProductsModule,
        ProductCategoriesModule,
        CartsModule,
        UserAddressesModule,
        OrdersModule,
        PaymentsModule,
    ],
    providers: [ResponseInterceptor],
})
export class AppModule {}
