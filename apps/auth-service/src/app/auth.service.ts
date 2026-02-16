import { LoginDto, LoginResponseDto, RegisterDto, UserResponseDto } from '@lumina/shared-dto';
import { LoggerService } from '@lumina/shared-logger';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { catchError, firstValueFrom, throwError, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class AuthService {
    private readonly context = AuthService.name;

    constructor(
        @Inject('USERS_SERVICE')
        private readonly usersClient: ClientProxy,
        private readonly logger: LoggerService,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto): Promise<UserResponseDto> {
        const { fullName, email, password } = registerDto;
        this.logger.log({ message: 'Initiating registration', email }, this.context);

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const payload = {
                fullName,
                email,
                password: hashedPassword,
            };

            const newUser = await firstValueFrom(
                this.usersClient.send<UserResponseDto>({ cmd: 'create_user' }, payload).pipe(
                    timeout(5000),
                    catchError((err) => {
                        if (err instanceof TimeoutError) {
                            return throwError(() => new TimeoutError());
                        }
                        return throwError(() => err);
                    }),
                ),
            );

            this.logger.log({ message: 'User registered', userId: newUser.id }, this.context);
            return newUser;
        } catch (error: any) {
            if (error instanceof TimeoutError) {
                this.logger.error(
                    { message: 'Registration timeout', email },
                    'Users Service Unreachable',
                    this.context,
                );
                throw new RpcException({
                    statusCode: HttpStatus.REQUEST_TIMEOUT,
                    message: 'Registration service is busy',
                    error: 'Request Timeout',
                });
            }

            if (error.statusCode && error.message) {
                if (error.statusCode === HttpStatus.CONFLICT) {
                    this.logger.warn({ message: 'Registration failed: Duplicate', email }, this.context);
                }
                throw new RpcException(error);
            }

            this.logger.error(
                { message: 'Critical Auth Error', email },
                (error as Error).stack || String(error),
                this.context,
            );

            throw new RpcException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An unexpected error occurred during registration',
                error: 'Internal Server Error',
            });
        }
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = loginDto;
        this.logger.log({ message: 'Attempting login', email }, this.context);

        const user = await this.findUserByEmail(email);

        const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordValid) {
            this.logger.warn({ message: 'Login failed: Invalid credentials', email }, this.context);
            throw new RpcException({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Invalid email or password',
                error: 'Unauthorized',
            });
        }

        return this.generateToken(user);
    }

    private async findUserByEmail(email: string): Promise<any> {
        try {
            return await firstValueFrom(
                this.usersClient.send({ cmd: 'find_user_by_email' }, { email }).pipe(
                    timeout(5000),
                    catchError((err) => {
                        if (err instanceof TimeoutError) {
                            return throwError(() => new TimeoutError());
                        }
                        return throwError(() => err);
                    }),
                ),
            );
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new RpcException({
                    statusCode: HttpStatus.REQUEST_TIMEOUT,
                    message: 'Users service unreachable',
                    error: 'Request Timeout',
                });
            }
            throw error;
        }
    }

    private async generateToken(user: any): Promise<LoginResponseDto> {
        const payload = {
            sub: user.id,
            email: user.email,
            fullName: user.fullName,
            type: 'access',
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN) || '1h',
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        });

        this.logger.log({ message: 'Login successful', userId: user.id }, this.context);

        return { accessToken };
    }
}
