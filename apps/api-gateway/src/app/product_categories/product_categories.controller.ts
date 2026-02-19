import { Roles } from '@lumina/shared-common';
import { BaseResponseDto, CreateProductCategoryDto, ProductCategoryResponseDto } from '@lumina/shared-dto';
import { UserRole } from '@lumina/shared-interfaces';
import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductCategoriesService } from './product_categories.service';

@Controller('product-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCategoriesController {
    constructor(private readonly productCategoriesService: ProductCategoriesService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    async create(
        @Body() createProductCategoryDto: CreateProductCategoryDto,
    ): Promise<BaseResponseDto<ProductCategoryResponseDto>> {
        const result = await this.productCategoriesService.create(createProductCategoryDto);
        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            timestamp: new Date(),
            message: 'Product category created successfully',
            data: result,
        };
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    async findAll(): Promise<BaseResponseDto<ProductCategoryResponseDto[]>> {
        const result = await this.productCategoriesService.findAll();
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product categories found successfully',
            data: result,
        };
    }
}
