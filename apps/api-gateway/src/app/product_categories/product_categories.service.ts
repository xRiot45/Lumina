import { MICROSERVICES, PRODUCT_CATEGORIES_COMMAND_PATTERN } from '@lumina/shared-common';
import { CreateProductCategoryDto, PaginationDto, ProductCategoryResponseDto } from '@lumina/shared-dto';
import {
    IDeleteProductCategoryPayload,
    IPaginatedResponse,
    IUpdateProductCategoryPayload,
} from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductCategoriesService {
    constructor(
        @Inject(MICROSERVICES.PRODUCTS) private readonly productsClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async create(dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const context = `[GATEWAY] ${this.constructor.name} ${this.create.name}`;
        this.logger.log({ message: 'Initiating product category create', dto }, context);

        try {
            const response = await firstValueFrom(
                this.productsClient.send(PRODUCT_CATEGORIES_COMMAND_PATTERN.CREATE_PRODUCT_CATEGORY, dto),
            );
            return mapToDto(ProductCategoryResponseDto, response);
        } catch (error: unknown) {
            this.logger.error({ message: '[Gateway] Raw Error from Microservice', error }, context);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException(
                    {
                        statusCode: status,
                        message: message,
                        error: errorName,
                    },
                    status,
                );
            }

            if (error instanceof Error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: error.message,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Unknown Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAll(query: PaginationDto): Promise<IPaginatedResponse<ProductCategoryResponseDto>> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.findAll.name}`;
        this.logger.log({ message: 'Initiating product category find all', query }, context);

        try {
            const response = await firstValueFrom(
                this.productsClient.send(PRODUCT_CATEGORIES_COMMAND_PATTERN.FIND_ALL_PRODUCT_CATEGORIES, query),
            );
            return response;
        } catch (error: unknown) {
            this.logger.error({ message: `Raw Error from Microservice: ${JSON.stringify(error)}` }, context);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException(
                    {
                        statusCode: status,
                        message: message,
                        error: errorName,
                    },
                    status,
                );
            }

            if (error instanceof Error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: error.message,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Unknown Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findById(id: string): Promise<ProductCategoryResponseDto> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.findById.name}`;
        this.logger.log({ message: 'Initiating product category find by id', id }, context);

        try {
            const response = await firstValueFrom(
                this.productsClient.send(PRODUCT_CATEGORIES_COMMAND_PATTERN.FIND_PRODUCT_CATEGORY_BY_ID, id),
            );
            return mapToDto(ProductCategoryResponseDto, response);
        } catch (error: unknown) {
            this.logger.error({ message: `Raw Error from Microservice: ${JSON.stringify(error)}` }, context);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException(
                    {
                        statusCode: status,
                        message: message,
                        error: errorName,
                    },
                    status,
                );
            }

            if (error instanceof Error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: error.message,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Unknown Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(id: string, dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.update.name}`;
        this.logger.log({ message: 'Initiating product category update', id, dto }, context);

        const payload: IUpdateProductCategoryPayload = {
            id,
            data: dto,
        };

        try {
            const response = await firstValueFrom(
                this.productsClient.send(PRODUCT_CATEGORIES_COMMAND_PATTERN.UPDATE_PRODUCT_CATEGORY, payload),
            );
            return mapToDto(ProductCategoryResponseDto, response);
        } catch (error: unknown) {
            this.logger.error({ message: `Raw Error from Microservice: ${JSON.stringify(error)}` }, context);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException(
                    {
                        statusCode: status,
                        message: message,
                        error: errorName,
                    },
                    status,
                );
            }

            if (error instanceof Error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: error.message,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Unknown Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async remove(id: string): Promise<void> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.remove.name}`;
        this.logger.log({ message: 'Initiating product category remove', id }, context);

        const payload: IDeleteProductCategoryPayload = {
            id,
        };

        try {
            await firstValueFrom(this.productsClient.send({ cmd: 'remove_product_category' }, payload));
            return;
        } catch (error: unknown) {
            this.logger.error(`[Gateway] Raw Error from Microservice: ${JSON.stringify(error)}`);

            if (isMicroserviceError(error)) {
                const status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
                const message = error.message || 'Service Error';
                const errorName = error.error || 'Bad Request';

                throw new HttpException(
                    {
                        statusCode: status,
                        message: message,
                        error: errorName,
                    },
                    status,
                );
            }

            if (error instanceof Error) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: error.message,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Unknown Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
