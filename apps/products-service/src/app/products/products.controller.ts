import { CreateProductDto, PaginationDto, ProductResponseDto } from '@lumina/shared-dto';
import { IPaginatedResponse } from '@lumina/shared-interfaces';
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

    @MessagePattern({ cmd: 'find_all_products' })
    async findAll(@Payload() payload: PaginationDto): Promise<IPaginatedResponse<ProductResponseDto>> {
        return await this.productsService.findAll(payload);
    }
}
