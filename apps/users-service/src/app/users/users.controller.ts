import { RegisterDto } from '@lumina/shared-dto';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern({ cmd: 'create_user' })
    async create(data: RegisterDto) {
        return await this.usersService.create(data);
    }
}
