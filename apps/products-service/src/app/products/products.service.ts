import { CreateProductDto, PaginationDto, ProductResponseDto, UpdateProductDto } from '@lumina/shared-dto';
import { IPaginatedResponse } from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { autoGenerateSlug, isDatabaseError } from '@lumina/shared-utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProductEntity } from '../../core/database/entities/product.entity';
import { ProductCategoryEntity } from '../../core/database/entities/product_category.entity';
import { ProductVariantEntity } from '../../core/database/entities/product_variant.entity';

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

    async findAll(dto: PaginationDto): Promise<IPaginatedResponse<ProductResponseDto>> {
        this.logger.log({ message: 'Initiating product find all', dto }, this.context);

        try {
            const page = dto?.page ?? 1;
            const limit = dto?.limit ?? 10;
            const order = dto?.order ?? 'ASC';

            const skip = (page - 1) * limit;
            const whereCondition = dto?.search ? { name: ILike(`%${dto.search}%`) } : {};

            const [products, totalItems] = await this.productRepository.findAndCount({
                where: whereCondition,
                order: { name: order },
                skip: skip,
                take: limit,
                relations: ['category', 'variants'],
            });

            const totalPages = Math.ceil(totalItems / limit);
            const result: IPaginatedResponse<ProductResponseDto> = {
                data: products,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                },
            };

            this.logger.log({ message: 'Product find all successful', result }, this.context);
            return result;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Failed to find all products', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while finding all products',
                error: 'Internal Server Error',
            });
        }
    }

    async findBySlug(slug: string): Promise<ProductResponseDto> {
        this.logger.log({ message: 'Initiating product find by slug', slug }, this.context);

        try {
            const product = await this.productRepository.findOne({
                where: { slug: slug },
                relations: ['category', 'variants'],
            });

            if (!product) {
                this.logger.warn({ message: 'Product not found', slug }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    error: 'Not Found',
                });
            }

            this.logger.log({ message: 'Product found', slug: product.slug, name: product.name }, this.context);
            return product;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Failed to find product by slug', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while finding the product',
                error: 'Internal Server Error',
            });
        }
    }

    async findById(id: string): Promise<ProductResponseDto> {
        this.logger.log({ message: 'Initiating product find by id', id }, this.context);

        try {
            const product = await this.productRepository.findOne({
                where: { id: id },
                relations: ['category', 'variants'],
            });

            if (!product) {
                this.logger.warn({ message: 'Product not found', id }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    error: 'Not Found',
                });
            }

            this.logger.log({ message: 'Product found', id: product.id, name: product.name }, this.context);
            return product;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'Failed to find product by slug', error: errorMessage },
                errorStack,
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while finding the product',
                error: 'Internal Server Error',
            });
        }
    }

    async update(productId: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
        const { name, basePrice, description, image, categoryId, variants } = dto;
        this.logger.log({ message: 'Initiating product update', dto }, this.context);

        try {
            const productCategory = await this.productCategoryRepository.findOneBy({ id: categoryId });
            if (!productCategory) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    error: 'Not Found',
                });
            }

            const product = await this.productRepository.findOne({
                where: { id: productId },
                relations: ['variants'],
            });

            if (!product) {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    error: 'Not Found',
                });
            }

            if (product.variants && product.variants.length > 0) {
                await this.productVariantRepository.remove(product.variants);
            }

            const newVariants = variants.map((variant) => {
                return this.productVariantRepository.create({
                    sku: variant.sku,
                    price: variant.price,
                    stock: variant.stock,
                });
            });

            if (product.name !== name) {
                this.logger.log({ message: `Product name changed. Generating new slug for: ${name}` }, this.context);
                product.name = name;
                product.slug = autoGenerateSlug(name);
            }

            product.basePrice = basePrice;
            product.description = description;
            product.image = image;
            product.category = productCategory;
            product.variants = newVariants;

            await this.productRepository.save(product);

            this.logger.log({ message: 'Product updated successfully', productId }, this.context);
            return product;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to update product', error: errorMessage }, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while updating the product',
                error: 'Internal Server Error',
            });
        }
    }
}
