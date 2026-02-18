import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './app/products/products.module';
import { DatabaseModule } from './core/database/database.module';
import { CategoriesModule } from './app/categories/categories.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        ProductsModule,
        CategoriesModule,
    ],
    providers: [],
})
export class MainModule {}
