import {
    CreateProductCategoryDto,
    PaginationDto,
    ProductCategoryResponseDto,
    UpdateProductCategoryDto,
} from '@lumina/shared-dto';
import { IPaginatedResponse } from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { autoGenerateSlug } from '@lumina/shared-utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProductCategoryEntity } from './entities/product_category.entity';

@Injectable()
export class ProductCategoriesService {
    private readonly context = `[SERVICE] ${ProductCategoriesService.name}`;

    constructor(
        @InjectRepository(ProductCategoryEntity)
        private readonly productCategoriesRepository: Repository<ProductCategoryEntity>,
        private readonly logger: LoggerService,
    ) {}

    async create(dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const { name } = dto;
        this.logger.log({ message: 'Initiating category creation', name }, this.context);

        try {
            const slug = autoGenerateSlug(name);
            const newCategory = this.productCategoriesRepository.create({
                name,
                slug,
            });

            await this.productCategoriesRepository.save(newCategory);

            this.logger.log({ message: 'Category created', id: newCategory.id, name }, this.context);
            return newCategory;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const err = error as any;

            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                this.logger.warn({ message: 'Category creation failed: Duplicate', name }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Category with this name or slug already exists',
                    error: 'Conflict',
                });
            }

            const errorMessage = err instanceof Error ? err.message : String(err);
            const errorStack = err instanceof Error ? err.stack : undefined;

            this.logger.error({ message: 'Error creating category', error: errorMessage }, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create category',
                error: 'Internal Server Error',
            });
        }
    }

    async findAll(dto: PaginationDto): Promise<IPaginatedResponse<ProductCategoryResponseDto>> {
        this.logger.log({ message: 'Initiating paginated category find all', dto }, this.context);

        try {
            const page = dto?.page ?? 1;
            const limit = dto?.limit ?? 10;
            const order = dto?.order ?? 'ASC';

            const skip = (page - 1) * limit;
            const whereCondition = dto?.search ? { name: ILike(`%${dto.search}%`) } : {};

            const [categories, totalItems] = await this.productCategoriesRepository.findAndCount({
                where: whereCondition,
                order: { name: order },
                skip: skip,
                take: limit,
            });

            const totalPages = Math.ceil(totalItems / limit);
            const result: IPaginatedResponse<ProductCategoryResponseDto> = {
                data: categories,
                meta: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                },
            };

            this.logger.log(
                {
                    message: 'Categories found',
                    count: categories.length,
                    totalItems,
                },
                this.context,
            );

            return result;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({ message: 'Error finding categories', error: errorMessage }, errorStack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to retrieve categories',
                error: 'Internal Server Error',
            });
        }
    }

    async findById(id: string): Promise<ProductCategoryResponseDto> {
        this.logger.log({ message: 'Initiating category find by id', id }, this.context);

        try {
            const category = await this.productCategoriesRepository.findOneBy({ id });

            if (!category) {
                this.logger.warn({ message: 'Category not found', id }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    error: 'Not Found',
                });
            }

            this.logger.log({ message: 'Category found', id: category.id, name: category.name }, this.context);
            return category;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const err = error as any;
            if (err.code === 'ER_BAD_FIELD_ERROR' || (err.message && err.message.includes('uuid'))) {
                this.logger.warn({ message: 'Invalid ID format provided', id }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Invalid category ID format',
                    error: 'Bad Request',
                });
            }

            if (err.code === 'ER_NO_DEFAULT_FOR_FIELD') {
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    error: 'Not Found',
                });
            }

            // 4. Fallback: Benar-benar System Error (Misal DB mati)
            this.logger.error({ message: 'Error finding category', error: err.message }, err.stack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to find category',
                error: 'Internal Server Error',
            });
        }
    }

    async update(id: string, dto: UpdateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        this.logger.log({ message: 'Initiating category update', id }, this.context);

        try {
            const category = await this.productCategoriesRepository.findOneBy({ id });
            if (!category) {
                this.logger.warn({ message: 'Category not found', id }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    error: 'Not Found',
                });
            }

            if (category.name !== dto.name) {
                category.name = dto.name;
                category.slug = autoGenerateSlug(dto.name);

                await this.productCategoriesRepository.save(category);
            }

            this.logger.log({ message: 'Category updated', id: category.id, name: category.name }, this.context);
            return category;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const err = error as any;
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                this.logger.warn(
                    { message: 'Update failed: Category name already exists', id, name: dto.name },
                    this.context,
                );
                throw new RpcException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Category with this name or slug already exists',
                    error: 'Conflict',
                });
            }

            if (err.code === 'ER_BAD_FIELD_ERROR' || (err.message && err.message.includes('uuid'))) {
                this.logger.warn({ message: 'Invalid ID format provided', id }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Invalid category ID format',
                    error: 'Bad Request',
                });
            }

            this.logger.error({ message: 'Error updating category', error: err.message }, err.stack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to update category',
                error: 'Internal Server Error',
            });
        }
    }

    async remove(id: string): Promise<{ success: boolean }> {
        this.logger.log({ message: 'Initiating category removal', id }, this.context);

        try {
            const category = await this.productCategoriesRepository.findOneBy({ id });

            if (!category) {
                this.logger.warn({ message: 'Category not found', id }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Category not found',
                    error: 'Not Found',
                });
            }

            await this.productCategoriesRepository.remove(category);

            this.logger.log({ message: 'Category removed', id: category.id, name: category.name }, this.context);
            return { success: true };
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const err = error as any;
            if (err.code === 'ER_BAD_FIELD_ERROR' || (err.message && err.message.includes('uuid'))) {
                this.logger.warn({ message: 'Invalid ID format provided', id }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Invalid category ID format',
                    error: 'Bad Request',
                });
            }

            this.logger.error({ message: 'Error removing category', error: err.message }, err.stack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to remove category',
                error: 'Internal Server Error',
            });
        }
    }
}
