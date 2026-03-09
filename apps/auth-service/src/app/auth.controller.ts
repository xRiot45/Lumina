import { AUTH_COMMAND_PATTERN } from '@lumina/shared-common';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, UserResponseDto } from '@lumina/shared-dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(AUTH_COMMAND_PATTERN.REGISTER)
    async register(@Payload() payload: RegisterRequestDto): Promise<UserResponseDto> {
        return await this.authService.register(payload);
    }

    @MessagePattern(AUTH_COMMAND_PATTERN.LOGIN)
    async login(@Payload() payload: LoginRequestDto): Promise<LoginResponseDto> {
        return await this.authService.login(payload);
    }
}
