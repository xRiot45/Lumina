import { Controller } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserAddressPayloadDto, UserAddressResponseDto } from '@lumina/shared-dto';

@Controller()
export class UserAddressesController {
    constructor(private readonly userAddressesService: UserAddressesService) {}

    @MessagePattern({ cmd: 'create_user_address' })
    async create(@Payload() payload: CreateUserAddressPayloadDto): Promise<UserAddressResponseDto> {
        return await this.userAddressesService.create(payload?.userId, payload?.data);
    }
}
