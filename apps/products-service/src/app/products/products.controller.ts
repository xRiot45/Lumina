import { CreateProductDto, ProductResponseDto } from '@lumina/shared-dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @MessagePattern({ cmd: 'create_product' })
    async create(@Payload() payload: CreateProductDto): Promise<ProductResponseDto> {
        return await this.productsService.create(payload);
    }
}
