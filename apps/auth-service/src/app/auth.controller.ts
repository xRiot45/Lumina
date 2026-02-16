import { LoginDto, LoginResponseDto, RegisterDto, UserResponseDto } from '@lumina/shared-dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern({ cmd: 'auth_register' })
    async register(@Payload() registerDto: RegisterDto): Promise<UserResponseDto> {
        return await this.authService.register(registerDto);
    }

    @MessagePattern({ cmd: 'auth_login' })
    async login(@Payload() loginDto: LoginDto): Promise<LoginResponseDto> {
        return await this.authService.login(loginDto);
    }
}
