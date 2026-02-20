import { CreateProductDto, ProductResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
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

    async create(dto: CreateProductDto): Promise<ProductResponseDto> {
        this.logger.log({ message: `[Gateway] Incoming create request`, dto }, this.context);

        try {
            const response = await firstValueFrom(this.productsClient.send({ cmd: 'create_product' }, dto));
            return mapToDto(ProductResponseDto, response);
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
