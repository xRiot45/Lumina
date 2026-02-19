import { Roles } from '@lumina/shared-common';
import {
    BaseResponseDto,
    CreateProductCategoryDto,
    PaginationDto,
    ProductCategoryResponseDto,
    UpdateProductCategoryDto,
} from '@lumina/shared-dto';
import { UserRole } from '@lumina/shared-interfaces';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductCategoriesService } from './product_categories.service';

@Controller('product-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCategoriesController {
    constructor(private readonly productCategoriesService: ProductCategoriesService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateProductCategoryDto): Promise<BaseResponseDto<ProductCategoryResponseDto>> {
        const result = await this.productCategoriesService.create(dto);
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
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() query: PaginationDto): Promise<BaseResponseDto<ProductCategoryResponseDto[]>> {
        const result = await this.productCategoriesService.findAll(query);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product categories retrieved successfully',
            data: result.data,
            meta: result.meta,
        };
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<BaseResponseDto<ProductCategoryResponseDto>> {
        const result = await this.productCategoriesService.findById(id);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product category found successfully',
            data: result,
        };
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() dto: UpdateProductCategoryDto) {
        const result = await this.productCategoriesService.update(id, dto);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product category updated successfully',
            data: result,
        };
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<BaseResponseDto> {
        await this.productCategoriesService.remove(id);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product category deleted successfully',
        };
    }
}
