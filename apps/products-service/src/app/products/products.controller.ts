import { CreateProductDto, PaginationDto, ProductResponseDto } from '@lumina/shared-dto';
import type {
    IDeleteProductPayload,
    IFindProductByIdPayload,
    IFindProductBySlugPayload,
    IPaginatedResponse,
    IUpdateProductPayload,
} from '@lumina/shared-interfaces';
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

    @MessagePattern({ cmd: 'find_product_by_slug' })
    async findBySlug(@Payload() payload: IFindProductBySlugPayload): Promise<ProductResponseDto> {
        return await this.productsService.findBySlug(payload?.slug);
    }

    @MessagePattern({ cmd: 'find_product_by_id' })
    async findById(@Payload() payload: IFindProductByIdPayload): Promise<ProductResponseDto> {
        return await this.productsService.findById(payload?.id);
    }

    @MessagePattern({ cmd: 'update_product' })
    async update(@Payload() payload: IUpdateProductPayload): Promise<ProductResponseDto> {
        return await this.productsService.update(payload?.id, payload?.data);
    }

    @MessagePattern({ cmd: 'delete_product' })
    async remove(@Payload() payload: IDeleteProductPayload): Promise<{ success: boolean }> {
        return await this.productsService.remove(payload.id);
    }
}
