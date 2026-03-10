import { MICROSERVICES, PRODUCTS_COMMAND_PATTERN } from '@lumina/shared-common';
import { CreateProductDto, PaginationDto, ProductResponseDto, UpdateProductDto } from '@lumina/shared-dto';
import { IPaginatedResponse } from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { deleteFile, isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
    constructor(
        @Inject(MICROSERVICES.PRODUCTS) private readonly productsClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async create(dto: CreateProductDto, file: Express.Multer.File): Promise<ProductResponseDto> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.create.name}`;
        this.logger.log({ message: `Incoming create request`, name: dto.name }, context);

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
            const response = await firstValueFrom(
                this.productsClient.send(PRODUCTS_COMMAND_PATTERN.CREATE_PRODUCT, dto),
            );
            return mapToDto(ProductResponseDto, response);
        } catch (error: unknown) {
            this.logger.warn({ message: `Creation failed. Rolling back image: ${dto.image}` }, context);
            await deleteFile(dto.image);

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

    async findAll(query: PaginationDto): Promise<IPaginatedResponse<ProductResponseDto>> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.findAll.name}`;
        this.logger.log({ message: `Incoming find all request`, query }, context);

        try {
            const response = await firstValueFrom(
                this.productsClient.send(PRODUCTS_COMMAND_PATTERN.FIND_ALL_PRODUCTS, query),
            );
            return response;
        } catch (error) {
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

    async findBySlug(slug: string): Promise<ProductResponseDto> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.findBySlug.name}`;
        this.logger.log({ message: `Incoming find by slug request`, slug }, context);

        try {
            const response = await firstValueFrom(
                this.productsClient.send(PRODUCTS_COMMAND_PATTERN.FIND_PRODUCT_BY_SLUG, { slug: slug }),
            );
            return mapToDto(ProductResponseDto, response);
        } catch (error) {
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

    async findById(productId: string): Promise<ProductResponseDto> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.findById.name}`;
        this.logger.log({ message: `Incoming find by id request`, productId }, context);

        try {
            const response = await firstValueFrom(
                this.productsClient.send(PRODUCTS_COMMAND_PATTERN.FIND_PRODUCT_BY_ID, { id: productId }),
            );
            return mapToDto(ProductResponseDto, response);
        } catch (error) {
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

    async update(productId: string, dto: UpdateProductDto, file?: Express.Multer.File): Promise<ProductResponseDto> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.update.name}`;
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
                this.productsClient.send(PRODUCTS_COMMAND_PATTERN.UPDATE_PRODUCT, { id: productId, data: dto }),
            );

            if (newImage && oldImage && newImage !== oldImage) {
                this.logger.log({ message: `Deleting old image from storage: ${oldImage}` }, context);
                await deleteFile(oldImage);
            }

            return mapToDto(ProductResponseDto, response);
        } catch (error) {
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

    async remove(productId: string): Promise<void> {
        const context = `[GATEWAY] ${this.constructor.name} : ${this.remove.name}`;
        this.logger.log({ message: `Incoming remove request`, productId }, context);

        try {
            const existingProduct = await this.findById(productId);
            const imageToDelete = existingProduct?.image;

            await firstValueFrom(this.productsClient.send(PRODUCTS_COMMAND_PATTERN.DELETE_PRODUCT, { id: productId }));

            if (imageToDelete) {
                this.logger.log({ message: `Deleting image from storage: ${imageToDelete}` }, context);
                await deleteFile(imageToDelete);
            }

            return;
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
}
