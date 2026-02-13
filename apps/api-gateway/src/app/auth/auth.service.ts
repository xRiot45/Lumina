import { RegisterDto, UserResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { mapToDto } from '@lumina/shared-utils';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    private readonly context = `${AuthService.name}`;

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
        } catch (error: any) {
            this.logger.error(`[Gateway] Raw Error from Microservice: ${JSON.stringify(error)}`);

            if (error.statusCode || error.status) {
                throw new HttpException(
                    {
                        statusCode: error.statusCode || error.status,
                        message: error.message || 'Service Error',
                        error: error.error || 'Bad Request',
                    },
                    error.statusCode || error.status,
                );
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Internal Server Error (Gateway)',
                    error: 'Internal Server Error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
