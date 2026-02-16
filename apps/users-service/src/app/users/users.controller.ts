import { RegisterDto } from '@lumina/shared-dto';
import type { IFindUserPayload } from '@lumina/shared-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern({ cmd: 'create_user' })
    async create(@Payload() data: RegisterDto) {
        return await this.usersService.create(data);
    }

    @MessagePattern({ cmd: 'find_user_by_email' })
    async findUserByEmail(@Payload() data: IFindUserPayload) {
        return await this.usersService.findUserByEmail(data?.email);
    }
}
