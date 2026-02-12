import { RegisterDto } from '@lumina/shared-dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern({ cmd: 'auth_register' })
    async register(@Payload() data: RegisterDto) {
        return await this.authService.register(data);
    }
}
