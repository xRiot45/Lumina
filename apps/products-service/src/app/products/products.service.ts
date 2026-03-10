import {
    CreateProductDto,
    PaginationDto,
    ProductResponseDto,
    StockReductionItemDto,
    UpdateProductDto,
} from '@lumina/shared-dto';
import { IPaginatedResponse } from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { autoGenerateSlug } from '@lumina/shared-utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { ProductEntity } from '../../core/database/entities/product.entity';
import { ProductCategoryEntity } from '../../core/database/entities/product_category.entity';
import { ProductVariantEntity } from '../../core/database/entities/product_variant.entity';

@Injectable()
export class ProductsService {
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
        const context = `[SERVICE] ${ProductsService.name} ${this.create.name}`;
        const { name, description, image, categoryId, variants } = dto;

        let calculatedBasePrice = 0;
        this.logger.log({ message: 'Initiating product creation', dto }, context);

        try {
            const productCategory = await this.productCategoryRepository.findOneBy({ id: categoryId });
            if (!productCategory) {
                this.logger.warn({ message: 'Product creation failed: Category not found', dto }, context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    error: 'Not Found',
                });
            }

            const slug = autoGenerateSlug(name);
            const existingProduct = await this.productRepository.findOne({
                where: [{ name: name }, { slug: slug }],
            });

            if (existingProduct) {
                this.logger.warn({ message: `Creation failed: Duplicate Product Name or Slug`, name, slug }, context);
                throw new RpcException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'A product with this Name or Slug already exists.',
                    error: 'Conflict',
                });
            }

            if (variants && variants.length > 0) {
                const skus = variants.map((v) => v.sku);

                const existingVariants = await this.productVariantRepository.find({
                    where: { sku: In(skus) },
                });

                if (existingVariants.length > 0) {
                    const duplicateSkus = existingVariants.map((v) => v.sku).join(', ');
                    this.logger.warn({ message: `Creation failed: Duplicate SKU(s)`, duplicateSkus }, context);
                    throw new RpcException({
                        statusCode: HttpStatus.CONFLICT,
                        message: `A variant with SKU(s) [${duplicateSkus}] already exists.`,
                        error: 'Conflict',
                    });
                }

                const allVariantsPrices = variants.map((v) => Number(v.price));
                const lowestVariantPrice = Math.min(...allVariantsPrices);

                if (!calculatedBasePrice || calculatedBasePrice === 0 || calculatedBasePrice > lowestVariantPrice) {
                    calculatedBasePrice = lowestVariantPrice;
                }
            }

            const productVariants =
                variants?.map((variant) => {
                    return this.productVariantRepository.create({
                        sku: variant.sku,
                        price: variant.price,
                        stock: variant.stock,
                    });
                }) || [];

            const newProduct = this.productRepository.create({
                name,
                slug,
                basePrice: calculatedBasePrice,
                description,
                image,
                category: productCategory,
                variants: productVariants,
            });

            const savedProduct = await this.productRepository.save(newProduct);

            this.logger.log(
                { message: 'Product successfully created with variants', productId: savedProduct.id },
                context,
            );

            return savedProduct;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to create product', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while create product',
                error: 'Internal Server Error',
            });
        }
    }

    async findAll(dto: PaginationDto): Promise<IPaginatedResponse<ProductResponseDto>> {
        const context = `[SERVICE] ${ProductsService.name} ${this.findAll.name}`;
        this.logger.log({ message: 'Initiating product find all', dto }, context);

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

            this.logger.log({ message: 'Product find all successful', result }, context);
            return result;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to find all products', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while finding all products',
                error: 'Internal Server Error',
            });
        }
    }

    async findBySlug(slug: string): Promise<ProductResponseDto> {
        const context = `[SERVICE] ${ProductsService.name} ${this.findBySlug.name}`;
        this.logger.log({ message: 'Initiating product find by slug', slug }, context);

        try {
            const product = await this.productRepository.findOne({
                where: { slug: slug },
                relations: ['category', 'variants'],
            });

            if (!product) {
                this.logger.warn({ message: 'Product not found', slug }, context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    error: 'Not Found',
                });
            }

            this.logger.log({ message: 'Product found', slug: product.slug, name: product.name }, context);
            return product;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to find product by slug', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while finding the product',
                error: 'Internal Server Error',
            });
        }
    }

    async findById(id: string): Promise<ProductResponseDto> {
        const context = `[SERVICE] ${ProductsService.name} ${this.findById.name}`;
        this.logger.log({ message: 'Initiating product find by id', id }, context);

        try {
            const product = await this.productRepository.findOne({
                where: { id: id },
                relations: ['variants', 'category'],
            });

            if (!product) {
                this.logger.warn({ message: 'Product not found', id }, context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    error: 'Not Found',
                });
            }

            this.logger.log({ message: 'Product found', id: product.id, name: product.name }, context);
            return product;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to find product by slug', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while finding the product',
                error: 'Internal Server Error',
            });
        }
    }

    async update(productId: string, data: UpdateProductDto): Promise<ProductResponseDto> {
        const context = `[SERVICE] ${ProductsService.name} ${this.update.name}`;
        const { name, description, image, categoryId, variants } = data;

        this.logger.log({ message: 'Initiating product update', data }, context);

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

            let calculatedBasePrice = product.basePrice;
            if (variants && variants.length > 0) {
                const allVariantPrices = variants.map((v) => Number(v.price));
                const lowestVariantPrice = Math.min(...allVariantPrices);

                calculatedBasePrice = lowestVariantPrice;
            }

            const newVariants = variants.map((variant) => {
                return this.productVariantRepository.create({
                    sku: variant.sku,
                    price: variant.price,
                    stock: variant.stock,
                });
            });

            if (product.name !== name) {
                this.logger.log({ message: `Product name changed. Generating new slug for: ${name}` }, context);
                product.name = name;
                product.slug = autoGenerateSlug(name);
            }

            product.basePrice = calculatedBasePrice;
            product.description = description;
            product.image = image;
            product.category = productCategory;
            product.variants = newVariants;

            await this.productRepository.save(product);

            this.logger.log({ message: 'Product updated successfully', productId }, context);
            return product;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to update product', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while updating the product',
                error: 'Internal Server Error',
            });
        }
    }

    async remove(productId: string): Promise<{ success: boolean }> {
        const context = `[SERVICE] ${ProductsService.name} ${this.remove.name}`;
        this.logger.log({ message: 'Initiating product deletion', productId }, context);

        try {
            const product = await this.productRepository.findOne({
                where: { id: productId },
                relations: ['variants'],
            });

            if (!product) {
                this.logger.warn({ message: 'Product deletion failed: Product not found', productId }, context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Product not found',
                    error: 'Not Found',
                });
            }

            if (product.variants && product.variants.length > 0) {
                await this.productVariantRepository.remove(product.variants);
            }

            await this.productRepository.remove(product);

            this.logger.log({ message: 'Product and its variants deleted successfully', productId }, context);
            return { success: true };
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Failed to delete product', error: errorMessage }, errorStack, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while deleting the product',
                error: 'Internal Server Error',
            });
        }
    }

    async handleReduceStock(items: StockReductionItemDto[]): Promise<void> {
        const context = `[SERVICE] ${ProductsService.name} ${this.handleReduceStock.name}`;
        this.logger.log({ message: 'Initiating stock reduction', items }, context);

        try {
            await Promise.all(
                items.map(async (item) => {
                    this.logger.debug(
                        { message: `Reducing Variant: ${item.variantId} by Quantity: ${item.quantity}` },
                        context,
                    );

                    const result = await this.productVariantRepository.decrement(
                        {
                            id: item.variantId,
                        },
                        'stock',
                        item.quantity,
                    );

                    if (result.affected === 0) {
                        this.logger.warn({ message: `Failed to reduce stock for Variant: ${item.variantId}` }, context);
                    }
                }),
            );

            this.logger.log({ message: 'Stock reduced successfully' }, context);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            this.logger.error({ message: 'Failed to reduce stock', error: errorMessage }, context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Critical error during stock reduction.',
            });
        }
    }
}
