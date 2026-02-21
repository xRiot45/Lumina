import { Roles } from '@lumina/shared-common';
import { BaseResponseDto, CreateProductDto, PaginationDto, ProductResponseDto } from '@lumina/shared-dto';
import { UserRole } from '@lumina/shared-interfaces';
import { createStorageConfig, deleteFile, fileFilter } from '@lumina/shared-utils';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
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
            limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
        }),
    )
    async create(
        @Body() dto: CreateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<BaseResponseDto<ProductResponseDto>> {
        if (!file) {
            throw new BadRequestException('Product image is required');
        }

        dto.image = `products/${file.filename}`;
        try {
            const result = await this.productsService.create(dto);
            return {
                success: true,
                statusCode: HttpStatus.CREATED,
                timestamp: new Date(),
                message: 'Product created successfully',
                data: result,
            };
        } catch (error: unknown) {
            await deleteFile(dto.image);
            throw error;
        }
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() query: PaginationDto): Promise<BaseResponseDto<ProductResponseDto[]>> {
        const result = await this.productsService.findAll(query);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Products retrieved successfully',
            data: result.data,
            meta: result.meta,
        };
    }

    @Get(':slug')
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string): Promise<BaseResponseDto<ProductResponseDto>> {
        const result = await this.productsService.findBySlug(slug);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product found successfully',
            data: result,
        };
    }
}
