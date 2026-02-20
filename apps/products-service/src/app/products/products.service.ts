import { CreateProductDto, ProductResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { autoGenerateSlug, isDatabaseError } from '@lumina/shared-utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../core/database/entities/product.entity';
import { ProductCategoryEntity } from '../../core/database/entities/product_category.entity';
import { ProductVariantEntity } from '../../core/database/entities/product_variant.entity';

import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
    private readonly context = `[SERVICE] ${ProductsService.name}`;

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(ProductCategoryEntity)
        private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
        @InjectRepository(ProductVariantEntity)
        private readonly productVariantRepository: Repository<ProductVariantEntity>,
        private readonly logger: LoggerService,
    ) {}

    async create(dto: CreateProductDto): Promise<ProductResponseDto> {
        const { name, basePrice, description, image, categoryId, variants } = dto;
        this.logger.log({ message: 'Initiating product creation', dto }, this.context);

        try {
            const productCategory = await this.productCategoryRepository.findOneBy({ id: categoryId });
            if (!productCategory) {
                this.logger.warn({ message: 'Product creation failed: Category not found', dto }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    error: 'Not Found',
                });
            }

            const productVariants = variants.map((variant) => {
                return this.productVariantRepository.create({
                    sku: variant.sku,
                    price: variant.price,
                    stock: variant.stock,
                });
            });

            const slug = autoGenerateSlug(name);
            const newProduct = this.productRepository.create({
                name,
                slug,
                basePrice,
                description,
                image,
                category: productCategory,
                variants: productVariants,
            });

            const savedProduct = await this.productRepository.save(newProduct);

            this.logger.log(
                { message: 'Product successfully created with variants', productId: savedProduct.id },
                this.context,
            );

            return savedProduct;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            if (isDatabaseError(error)) {
                if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                    const isSkuDuplicate = errorMessage.toLowerCase().includes('sku');
                    const conflictField = isSkuDuplicate ? 'SKU' : 'Product Name/Slug';

                    this.logger.warn(
                        { message: `Creation failed: Duplicate ${conflictField}`, name, errorMessage },
                        this.context,
                    );

                    throw new RpcException({
                        statusCode: HttpStatus.CONFLICT,
                        message: `A product or variant with this ${conflictField} already exists.`,
                        error: 'Conflict',
                    });
                }

                if (error.code === 'ER_BAD_FIELD_ERROR') {
                    throw new RpcException({
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: 'Invalid Category ID format',
                        error: 'Bad Request',
                    });
                }
            }

            if (errorMessage.toLowerCase().includes('uuid')) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Invalid ID format provided',
                    error: 'Bad Request',
                });
            }

            this.logger.error(
                { message: 'Failed to create product and variants', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while creating the product',
                error: 'Internal Server Error',
            });
        }
    }
}
