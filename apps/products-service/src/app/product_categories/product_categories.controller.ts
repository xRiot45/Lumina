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
import { PRODUCT_CATEGORIES_COMMAND_PATTERN } from '@lumina/shared-common';

@Controller()
export class ProductCategoriesController {
    constructor(private readonly productCategoriesService: ProductCategoriesService) {}

    @MessagePattern(PRODUCT_CATEGORIES_COMMAND_PATTERN.CREATE_PRODUCT_CATEGORY)
    async create(@Payload() payload: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        return await this.productCategoriesService.create(payload);
    }

    @MessagePattern(PRODUCT_CATEGORIES_COMMAND_PATTERN.FIND_ALL_PRODUCT_CATEGORIES)
    async findAll(@Payload() payload: PaginationDto): Promise<IPaginatedResponse<ProductCategoryResponseDto>> {
        return await this.productCategoriesService.findAll(payload);
    }

    @MessagePattern(PRODUCT_CATEGORIES_COMMAND_PATTERN.FIND_PRODUCT_CATEGORY_BY_ID)
    async findById(@Payload() payload: IFindProductCategoryByIdPayload): Promise<ProductCategoryResponseDto> {
        return await this.productCategoriesService.findById(payload?.id);
    }

    @MessagePattern(PRODUCT_CATEGORIES_COMMAND_PATTERN.UPDATE_PRODUCT_CATEGORY)
    async update(@Payload() payload: IUpdateProductCategoryPayload): Promise<ProductCategoryResponseDto> {
        return await this.productCategoriesService.update(payload?.id, payload?.data);
    }

    @MessagePattern(PRODUCT_CATEGORIES_COMMAND_PATTERN.DELETE_PRODUCT_CATEGORY)
    async remove(@Payload() payload: IDeleteProductCategoryPayload): Promise<{ success: boolean }> {
        return await this.productCategoriesService.remove(payload?.id);
    }
}
