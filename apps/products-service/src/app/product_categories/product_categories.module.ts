import { LoggerModule } from '@lumina/shared-logger';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryEntity } from 'src/core/database/entities/product_category.entity';
import { ProductCategoriesController } from './product_categories.controller';
import { ProductCategoriesService } from './product_categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductCategoryEntity]), LoggerModule],
    controllers: [ProductCategoriesController],
    providers: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
