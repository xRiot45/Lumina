import { CreateProductCategoryDto, ProductCategoryResponseDto } from '@lumina/shared-dto';
import { IDeleteProductCategoryPayload, IUpdateProductCategoryPayload } from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductCategoriesService {
    private readonly context = `[GATEWAY] ${ProductCategoriesService.name}`;

    constructor(
        @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async create(dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        this.logger.log(`[GATEWAY] Incoming create request for: ${JSON.stringify(dto)}`, this.context);

        try {
            const response = await firstValueFrom(this.productsClient.send({ cmd: 'create_product_category' }, dto));
            return mapToDto(ProductCategoryResponseDto, response);
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

    async findAll(): Promise<ProductCategoryResponseDto[]> {
        this.logger.log(`[GATEWAY] Incoming find all request`, this.context);

        try {
            const response: ProductCategoryResponseDto[] = await firstValueFrom(
                this.productsClient.send({ cmd: 'find_all_product_categories' }, {}),
            );
            return mapToDto(ProductCategoryResponseDto, response);
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

    async findById(id: string): Promise<ProductCategoryResponseDto> {
        this.logger.log(`[GATEWAY] Incoming find by id request for: ${id}`, this.context);

        try {
            const response = await firstValueFrom(this.productsClient.send({ cmd: 'find_product_category_by_id' }, id));
            return mapToDto(ProductCategoryResponseDto, response);
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

    async update(id: string, dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        this.logger.log(`[GATEWAY] Incoming update request for: ${id}`, this.context);

        const payload: IUpdateProductCategoryPayload = {
            id,
            data: dto,
        };

        try {
            const response = await firstValueFrom(
                this.productsClient.send({ cmd: 'update_product_category' }, payload),
            );
            return mapToDto(ProductCategoryResponseDto, response);
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

    async remove(id: string): Promise<void> {
        this.logger.log(`[GATEWAY] Incoming remove request for: ${id}`, this.context);

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
