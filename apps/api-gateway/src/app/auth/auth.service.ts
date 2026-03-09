import { AUTH_COMMAND_PATTERN, MICROSERVICES } from '@lumina/shared-common';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, UserResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        @Inject(MICROSERVICES.AUTH) private readonly authClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async register(dto: RegisterRequestDto): Promise<UserResponseDto> {
        const context = `[GATEWAY ${this.constructor.name}] : ${this.register.name}`;
        this.logger.log({ message: `Incoming register request for: ${dto.email}`, context });

        try {
            const response = await firstValueFrom(this.authClient.send(AUTH_COMMAND_PATTERN.REGISTER, dto));
            return mapToDto(UserResponseDto, response);
        } catch (error: unknown) {
            this.logger.error({ message: `Raw Error from Microservice: ${JSON.stringify(error)}`, context });

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

    async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
        const context = `[GATEWAY ${this.constructor.name}] : ${this.login.name}`;
        this.logger.log({ message: `Incoming login request for: ${dto.email}`, context });

        try {
            const response = await firstValueFrom(this.authClient.send(AUTH_COMMAND_PATTERN.LOGIN, dto));
            return mapToDto(LoginResponseDto, response);
        } catch (error: unknown) {
            this.logger.error({ message: `Raw Error from Microservice: ${JSON.stringify(error)}`, context });

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
