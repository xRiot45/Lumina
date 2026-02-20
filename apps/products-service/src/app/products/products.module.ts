import { LoggerModule } from '@lumina/shared-logger';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryEntity } from 'src/core/database/entities/product_category.entity';
import { ProductVariantEntity } from 'src/core/database/entities/product_variant.entity';
import { ProductEntity } from './../../core/database/entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, ProductCategoryEntity, ProductVariantEntity]), LoggerModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
