import { CreateProductCategoryDto, ProductCategoryResponseDto } from '@lumina/shared-dto';
import type { IUpdateProductCategoryPayload } from '@lumina/shared-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @MessagePattern({ cmd: 'create_product_category' })
    async create(@Payload() dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        return await this.categoriesService.create(dto);
    }

    @MessagePattern({ cmd: 'find_all_product_categories' })
    async findAll(): Promise<ProductCategoryResponseDto[]> {
        return await this.categoriesService.findAll();
    }

    @MessagePattern({ cmd: 'find_product_category_by_id' })
    async findById(@Payload() id: string): Promise<ProductCategoryResponseDto> {
        return await this.categoriesService.findById(id);
    }

    @MessagePattern({ cmd: 'update_product_category' })
    async update(@Payload() payload: IUpdateProductCategoryPayload): Promise<ProductCategoryResponseDto> {
        return await this.categoriesService.update(payload?.id, payload?.data);
    }
}
