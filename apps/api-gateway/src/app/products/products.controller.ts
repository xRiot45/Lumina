import { Roles } from '@lumina/shared-common';
import { BaseResponseDto, CreateProductDto, ProductResponseDto } from '@lumina/shared-dto';
import { UserRole } from '@lumina/shared-interfaces';
import { createStorageConfig, fileFilter } from '@lumina/shared-utils';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: createStorageConfig('products'),
            fileFilter: fileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async create(@Body() dto: CreateProductDto): Promise<BaseResponseDto<ProductResponseDto>> {
        const result = await this.productsService.create(dto);
        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            timestamp: new Date(),
            message: 'Product created successfully',
            data: result,
        };
    }
}
