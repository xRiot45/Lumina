import { CreateProductCategoryDto, PaginationDto, ProductCategoryResponseDto } from '@lumina/shared-dto';
import type {
    IDeleteProductCategoryPayload,
    IFindProductCategoryByIdPayload,
    IPaginatedResponse,
    IUpdateProductCategoryPayload,
} from '@lumina/shared-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductCategoriesService } from './product_categories.service';

@Controller()
export class ProductCategoriesController {
    constructor(private readonly productCategoriesService: ProductCategoriesService) {}

    @MessagePattern({ cmd: 'create_product_category' })
    async create(@Payload() payload: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        return await this.productCategoriesService.create(payload);
    }

    @MessagePattern({ cmd: 'find_all_product_categories' })
    async findAll(@Payload() payload: PaginationDto): Promise<IPaginatedResponse<ProductCategoryResponseDto>> {
        return await this.productCategoriesService.findAll(payload);
    }

    @MessagePattern({ cmd: 'find_product_category_by_id' })
    async findById(@Payload() payload: IFindProductCategoryByIdPayload): Promise<ProductCategoryResponseDto> {
        return await this.productCategoriesService.findById(payload?.id);
    }

    @MessagePattern({ cmd: 'update_product_category' })
    async update(@Payload() payload: IUpdateProductCategoryPayload): Promise<ProductCategoryResponseDto> {
        return await this.productCategoriesService.update(payload?.id, payload?.data);
    }

    @MessagePattern({ cmd: 'remove_product_category' })
    async remove(@Payload() payload: IDeleteProductCategoryPayload): Promise<{ success: boolean }> {
        return await this.productCategoriesService.remove(payload?.id);
    }
}
