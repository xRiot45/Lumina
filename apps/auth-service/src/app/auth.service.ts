import { RegisterDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
        private readonly logger: LoggerService,
    ) {}

    async register(registerDto: RegisterDto) {
        const context = `${AuthService.name}.register`;
        const { fullName, email, password } = registerDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            this.logger.log({ message: 'Registering new user', email }, context);
            const newUser = await firstValueFrom(
                this.usersClient.send(
                    { cmd: 'create_user' },
                    {
                        fullName,
                        email,
                        password: hashedPassword,
                    },
                ),
            );

            return newUser;
        } catch (error) {
            this.logger.error('Failed to register user', `${(error as Error).stack}`, 'AuthService');
            throw new ConflictException('Email already exists or database error');
        }
    }
}
