import { PRODUCTS_COMMAND_PATTERN, PRODUCTS_EVENT_PATTERN } from '@lumina/shared-common';
import {
    CreateProductDto,
    PaginationDto,
    ProductResponseDto,
    ReduceStockEventDto,
    UpdateProductPayloadDto,
} from '@lumina/shared-dto';
import type {
    IDeleteProductPayload,
    IFindProductByIdPayload,
    IFindProductBySlugPayload,
    IPaginatedResponse,
} from '@lumina/shared-interfaces';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @MessagePattern(PRODUCTS_COMMAND_PATTERN.CREATE_PRODUCT)
    async create(@Payload() payload: CreateProductDto): Promise<ProductResponseDto> {
        return await this.productsService.create(payload);
    }

    @MessagePattern(PRODUCTS_COMMAND_PATTERN.FIND_ALL_PRODUCTS)
    async findAll(@Payload() payload: PaginationDto): Promise<IPaginatedResponse<ProductResponseDto>> {
        return await this.productsService.findAll(payload);
    }

    @MessagePattern(PRODUCTS_COMMAND_PATTERN.FIND_PRODUCT_BY_SLUG)
    async findBySlug(@Payload() payload: IFindProductBySlugPayload): Promise<ProductResponseDto> {
        return await this.productsService.findBySlug(payload?.slug);
    }

    @MessagePattern(PRODUCTS_COMMAND_PATTERN.FIND_PRODUCT_BY_ID)
    async findById(@Payload() payload: IFindProductByIdPayload): Promise<ProductResponseDto> {
        return await this.productsService.findById(payload?.id);
    }

    @MessagePattern(PRODUCTS_COMMAND_PATTERN.UPDATE_PRODUCT)
    async update(@Payload() payload: UpdateProductPayloadDto): Promise<ProductResponseDto> {
        return await this.productsService.update(payload?.productId, payload?.data);
    }

    @MessagePattern(PRODUCTS_COMMAND_PATTERN.DELETE_PRODUCT)
    async remove(@Payload() payload: IDeleteProductPayload): Promise<{ success: boolean }> {
        return await this.productsService.remove(payload.id);
    }

    @EventPattern(PRODUCTS_EVENT_PATTERN.REDUCE_PRODUCT_VARIANT_STOCK)
    async reduceProductVariantStock(@Payload() payload: ReduceStockEventDto) {
        return await this.productsService.handleReduceStock(payload.items);
    }
}
