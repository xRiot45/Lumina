import { CreateUserAddressDto, CreateUserAddressPayloadDto, UserAddressResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserAddressesService {
    private readonly context = `[GATEWAY] ${UserAddressesService.name}`;

    constructor(
        @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async create(userId: string, dto: CreateUserAddressDto): Promise<UserAddressResponseDto> {
        this.logger.log({ message: 'Initiating create user address', dto }, this.context);

        try {
            const payload: CreateUserAddressPayloadDto = {
                userId: userId,
                data: dto,
            };

            const response = await firstValueFrom(this.usersClient.send({ cmd: 'create_user_address' }, payload));
            return mapToDto(UserAddressResponseDto, response);
        } catch (error: unknown) {
            this.logger.error(`[Gateway] Raw Error from Carts Microservice: ${JSON.stringify(error)}`);

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
