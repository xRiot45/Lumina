import { MICROSERVICES, USER_COMMAND_PATTERN } from '@lumina/shared-common';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, UserResponseDto } from '@lumina/shared-dto';
import { IJwtPayload, IUser } from '@lumina/shared-interfaces';
import { LoggerService } from '@lumina/shared-logger';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        @Inject(MICROSERVICES.USERS) private readonly usersClient: ClientProxy,
        private readonly logger: LoggerService,
        private readonly jwtService: JwtService,
    ) {}

    async register(payload: RegisterRequestDto): Promise<UserResponseDto> {
        const context = `[SERVICE] ${this.constructor.name} : ${this.register.name}`;
        this.logger.log({ message: 'Initiating registration process ', fullName: payload.fullName }, context);

        try {
            const user = await firstValueFrom(
                this.usersClient.send<IUser>(USER_COMMAND_PATTERN.FIND_USER_BY_EMAIL, payload.email),
            );

            if (user) {
                this.logger.warn(
                    { message: 'Registration failed: Email already exists', email: payload.email },
                    context,
                );
                throw new RpcException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Email already exists',
                    error: 'Conflict',
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(payload?.password, salt);

            payload.fullName = payload.fullName.trim();
            payload.email = payload.email.trim();
            payload.password = hashedPassword;

            const newUser = await firstValueFrom(
                this.usersClient.send<UserResponseDto>(USER_COMMAND_PATTERN.CREATE_USER, payload),
            );

            this.logger.log({ message: 'User registered', userId: newUser.id }, context);
            return newUser;
        } catch (error: unknown) {
            if (error instanceof RpcException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error(
                { message: 'An error occurred while registering', error: errorMessage },
                errorStack,
                context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while registering',
                error: 'Internal Server Error',
            });
        }
    }

    async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
        const context = `[SERVICE] ${this.constructor.name} : ${this.login.name}`;
        this.logger.log({ message: 'Attempting login', email: payload.email }, context);

        const user = await firstValueFrom(this.usersClient.send(USER_COMMAND_PATTERN.FIND_USER_BY_EMAIL, payload));
        const isPasswordValid = user ? await bcrypt.compare(payload?.password, user.password) : false;

        if (!user || !isPasswordValid) {
            this.logger.warn({ message: 'Login failed: Invalid credentials', email: payload.email }, context);
            throw new RpcException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Invalid email or password',
                error: 'Unauthorized',
            });
        }

        return this.generateToken(user);
    }

    private async generateToken(user: IUser) {
        const payload: IJwtPayload = {
            sub: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            type: 'access',
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN) || '1h',
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        });

        this.logger.log({ message: 'Login successful', userId: user.id });

        return { accessToken };
    }
}
