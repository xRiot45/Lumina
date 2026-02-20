import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductCategoriesModule } from './app/product_categories/product_categories.module';
import { ProductVariantsModule } from './app/product_variants/product_variants.module';
import { ProductsModule } from './app/products/products.module';
import { DatabaseModule } from './core/database/database.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        ProductsModule,
        ProductCategoriesModule,
        ProductVariantsModule,
    ],
    providers: [],
})
export class MainModule {}
