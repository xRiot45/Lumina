import { Module } from '@nestjs/common';
import { ProductVariantsController } from './product_variants.controller';
import { ProductVariantsService } from './product_variants.service';

@Module({
    controllers: [ProductVariantsController],
    providers: [ProductVariantsService],
})
export class ProductVariantsModule {}
