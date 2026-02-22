import { CreateProductDto, PaginationDto, ProductResponseDto, UpdateProductDto } from '@lumina/shared-dto';
import { IPaginatedResponse } from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { deleteFile, isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
    private readonly context = `[GATEWAY] ${ProductsService.name}`;

    constructor(
        @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async create(dto: CreateProductDto, file: Express.Multer.File): Promise<ProductResponseDto> {
        this.logger.log({ message: `[Gateway] Incoming create request`, name: dto.name }, this.context);

        if (!file) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Product image is required',
                    error: 'Bad Request',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        dto.image = `products/${file.filename}`;
        try {
            const response = await firstValueFrom(this.productsClient.send({ cmd: 'create_product' }, dto));
            return mapToDto(ProductResponseDto, response);
        } catch (error: unknown) {
            this.logger.warn(`[Gateway Service] Creation failed. Rolling back image: ${dto.image}`, this.context);
            await deleteFile(dto.image);

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

    async findAll(query: PaginationDto): Promise<IPaginatedResponse<ProductResponseDto>> {
        this.logger.log(`[GATEWAY] Incoming find all request`, this.context);

        try {
            const response = await firstValueFrom(this.productsClient.send({ cmd: 'find_all_products' }, query));
            return response;
        } catch (error) {
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

    async findBySlug(slug: string): Promise<ProductResponseDto> {
        this.logger.log(`[GATEWAY] Incoming find by slug request`, this.context);

        try {
            const response = await firstValueFrom(
                this.productsClient.send({ cmd: 'find_product_by_slug' }, { slug: slug }),
            );
            return mapToDto(ProductResponseDto, response);
        } catch (error) {
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

    async findById(productId: string): Promise<ProductResponseDto> {
        this.logger.log(`[GATEWAY] Incoming find by id request`, this.context);

        try {
            const response = await firstValueFrom(
                this.productsClient.send({ cmd: 'find_product_by_id' }, { id: productId }),
            );
            return mapToDto(ProductResponseDto, response);
        } catch (error) {
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

    async update(productId: string, dto: UpdateProductDto, file?: Express.Multer.File): Promise<ProductResponseDto> {
        const existingProduct = await this.findById(productId);
        const oldImage = existingProduct.image;
        let newImage: string | undefined = undefined;

        if (file) {
            newImage = `products/${file.filename}`;
            dto.image = newImage;
        } else {
            dto.image = oldImage;
        }

        try {
            const response = await firstValueFrom(
                this.productsClient.send({ cmd: 'update_product' }, { id: productId, data: dto }),
            );

            if (newImage && oldImage && newImage !== oldImage) {
                this.logger.log(`[Gateway Service] Deleting old product image: ${oldImage}`);
                await deleteFile(oldImage);
            }

            return mapToDto(ProductResponseDto, response);
        } catch (error) {
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

    async remove(productId: string): Promise<void> {
        this.logger.log(`[GATEWAY] Incoming delete request`, this.context);

        try {
            const existingProduct = await this.findById(productId);
            const imageToDelete = existingProduct?.image;

            await firstValueFrom(this.productsClient.send({ cmd: 'delete_product' }, { id: productId }));

            if (imageToDelete) {
                this.logger.log(`[Gateway Service] Deleting product image from storage: ${imageToDelete}`);
                await deleteFile(imageToDelete);
            }

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
