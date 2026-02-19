import { CreateProductCategoryDto, ProductCategoryResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { autoGenerateSlug } from '@lumina/shared-utils';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
    private readonly context = `[SERVICE] ${CategoriesService.name}`;

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoriesRepository: Repository<CategoryEntity>,
        private readonly logger: LoggerService,
    ) {}

    async create(dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const { name } = dto;
        this.logger.log({ message: 'Initiating category creation', name }, this.context);

        try {
            const slug = autoGenerateSlug(name);
            const newCategory = this.categoriesRepository.create({
                name,
                slug,
            });

            await this.categoriesRepository.save(newCategory);

            this.logger.log({ message: 'Category created', id: newCategory.id, name }, this.context);
            return newCategory;
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                this.logger.warn({ message: 'Category creation failed: Duplicate', name }, this.context);
                throw new RpcException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Category with this name or slug already exists',
                    error: 'Conflict',
                });
            }

            this.logger.error({ message: 'Error creating category', error: error.message }, error.stack, this.context);

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create category',
                error: 'Internal Server Error',
            });
        }
    }

    async findAll(): Promise<ProductCategoryResponseDto[]> {
        this.logger.log({ message: 'Initiating category find all' }, this.context);

        try {
            const categories = await this.categoriesRepository.find();
            this.logger.log({ message: 'Categories found', count: categories.length }, this.context);
            return categories;
        } catch (error: any) {
            this.logger.error({ message: 'Error finding categories', error: error.message }, error.stack, this.context);
            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to find categories',
                error: 'Internal Server Error',
            });
        }
    }
}
