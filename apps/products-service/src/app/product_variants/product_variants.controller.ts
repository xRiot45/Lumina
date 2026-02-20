import { Controller } from '@nestjs/common';
import { ProductVariantsService } from './product_variants.service';

@Controller()
export class ProductVariantsController {
    constructor(private readonly productVariantsService: ProductVariantsService) {}
}
