import { Roles } from '@lumina/shared-common';
import {
    BaseResponseDto,
    CreateProductDto,
    PaginationDto,
    ProductResponseDto,
    UpdateProductDto,
} from '@lumina/shared-dto';
import { UserRole } from '@lumina/shared-interfaces';
import { createStorageConfig, deleteFile, fileFilter } from '@lumina/shared-utils';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
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

    @Get('slug/:slug')
    @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string): Promise<BaseResponseDto<ProductResponseDto>> {
        const result = await this.productsService.findBySlug(slug);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product found by slug successfully',
            data: result,
        };
    }

    @Get(':productId')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async findById(@Param('productId') productId: string): Promise<BaseResponseDto<ProductResponseDto>> {
        const result = await this.productsService.findById(productId);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product found by id successfully',
            data: result,
        };
    }

    @Patch(':productId')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: createStorageConfig('products'),
            fileFilter: fileFilter,
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async update(
        @Body() dto: UpdateProductDto,
        @Param('productId') productId: string,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<BaseResponseDto<ProductResponseDto>> {
        const result = await this.productsService.update(productId, dto, file);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product updated successfully',
            data: result,
        };
    }

    @Delete(':productId')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('productId') productId: string): Promise<BaseResponseDto> {
        await this.productsService.remove(productId);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'Product deleted successfully',
        };
    }
}
