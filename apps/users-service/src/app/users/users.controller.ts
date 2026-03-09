import { USER_COMMAND_PATTERN } from '@lumina/shared-common';
import type { IFindUserByEmailPayload } from '@lumina/shared-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { RegisterRequestDto } from '@lumina/shared-dto';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern(USER_COMMAND_PATTERN.CREATE_USER)
    async createUser(@Payload() payload: RegisterRequestDto) {
        return await this.usersService.createUser(payload);
    }

    @MessagePattern(USER_COMMAND_PATTERN.FIND_USER_BY_EMAIL)
    async findUserByEmail(@Payload() payload: IFindUserByEmailPayload) {
        return await this.usersService.findUserByEmail(payload?.email);
    }
}
