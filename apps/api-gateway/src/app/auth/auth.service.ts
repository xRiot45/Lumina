import { LoginDto, LoginResponseDto, RegisterDto, UserResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { isMicroserviceError, mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    private readonly context = AuthService.name;

    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async register(registerDto: RegisterDto): Promise<UserResponseDto> {
        this.logger.log(`[Gateway] Incoming register request for: ${registerDto.email}`, this.context);

        try {
            const response = await firstValueFrom(this.authClient.send({ cmd: 'auth_register' }, registerDto));
            this.logger.log(
                {
                    message: `[Gateway] Registration successful`,
                    email: registerDto.email,
                },
                this.context,
            );

            return mapToDto(UserResponseDto, response);
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

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        this.logger.log(`[Gateway] Incoming login request for: ${loginDto.email}`, this.context);

        try {
            const response = await firstValueFrom(this.authClient.send({ cmd: 'auth_login' }, loginDto));
            this.logger.log(
                {
                    message: `[Gateway] Login successful`,
                    email: loginDto.email,
                },
                this.context,
            );

            return mapToDto(LoginResponseDto, response);
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
