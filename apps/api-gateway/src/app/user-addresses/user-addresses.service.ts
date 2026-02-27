import {
    CreateUserAddressDto,
    CreateUserAddressPayloadDto,
    RemoveUserAddressPayloadDto,
    SetDefaultUserAddressPayloadDto,
    UpdateUserAddressDto,
    UpdateUserAddressPayloadDto,
    UserAddressResponseDto,
} from '@lumina/shared-dto';
import { IFindOneUserAddressPayload } from '@lumina/shared-interfaces';
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

    async findAll(userId: string): Promise<UserAddressResponseDto[]> {
        this.logger.log({ message: 'Initiating find all user addresses', userId }, this.context);

        try {
            const response = await firstValueFrom(this.usersClient.send({ cmd: 'find_all_user_addresses' }, userId));
            return Array.isArray(response)
                ? mapToDto(UserAddressResponseDto, response)
                : [mapToDto(UserAddressResponseDto, response)];
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

    async findOne(userId: string, addressId: string): Promise<UserAddressResponseDto> {
        this.logger.log({ message: 'Initiating find one user address', userId, addressId }, this.context);

        try {
            const payload: IFindOneUserAddressPayload = {
                userId: userId,
                addressId: addressId,
            };

            const response = await firstValueFrom(this.usersClient.send({ cmd: 'find_one_user_address' }, payload));
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

    async update(userId: string, addressId: string, dto: UpdateUserAddressDto): Promise<UserAddressResponseDto> {
        this.logger.log({ message: 'Initiating update user address', userId, addressId, dto }, this.context);

        try {
            const payload: UpdateUserAddressPayloadDto = {
                userId: userId,
                addressId: addressId,
                data: dto,
            };

            const response = await firstValueFrom(this.usersClient.send({ cmd: 'update_user_address' }, payload));
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

    async setDefault(userId: string, addressId: string): Promise<UserAddressResponseDto> {
        this.logger.log({ message: 'Initiating set default user address', userId, addressId }, this.context);

        try {
            const payload: SetDefaultUserAddressPayloadDto = {
                userId: userId,
                addressId: addressId,
            };

            const response = await firstValueFrom(this.usersClient.send({ cmd: 'set_default_user_address' }, payload));
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

    async remove(userId: string, addressId: string): Promise<void> {
        this.logger.log({ message: 'Initiating remove user address', userId, addressId }, this.context);

        try {
            const payload: RemoveUserAddressPayloadDto = {
                userId: userId,
                addressId: addressId,
            };

            await firstValueFrom(this.usersClient.send({ cmd: 'remove_user_address' }, payload));
            return;
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
