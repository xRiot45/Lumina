import { BaseResponseDto, LoginDto, LoginResponseDto, RegisterDto, UserResponseDto } from '@lumina/shared-dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto): Promise<BaseResponseDto<UserResponseDto>> {
        const result = await this.authService.register(registerDto);
        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            timestamp: new Date(),
            message: 'User registered successfully',
            data: result,
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<BaseResponseDto<LoginResponseDto>> {
        const result = await this.authService.login(loginDto);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'User logged in successfully',
            data: result,
        };
    }
}
