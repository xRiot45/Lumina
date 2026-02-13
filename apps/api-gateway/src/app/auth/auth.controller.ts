import { BaseResponseDto, RegisterDto, UserResponseDto } from '@lumina/shared-dto';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
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
}
