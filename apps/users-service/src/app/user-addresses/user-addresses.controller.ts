import { Controller } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserAddressPayloadDto, FindOneUserAddressPayloadDto, UserAddressResponseDto } from '@lumina/shared-dto';

@Controller()
export class UserAddressesController {
    constructor(private readonly userAddressesService: UserAddressesService) {}

    @MessagePattern({ cmd: 'create_user_address' })
    async create(@Payload() payload: CreateUserAddressPayloadDto): Promise<UserAddressResponseDto> {
        return await this.userAddressesService.create(payload?.userId, payload?.data);
    }

    @MessagePattern({ cmd: 'find_all_user_addresses' })
    async findAll(@Payload() payload: string): Promise<UserAddressResponseDto[]> {
        return await this.userAddressesService.findAll(payload);
    }

    @MessagePattern({ cmd: 'find_one_user_address' })
    async findOne(@Payload() payload: FindOneUserAddressPayloadDto): Promise<UserAddressResponseDto> {
        return await this.userAddressesService.findOne(payload?.userId, payload?.addressId);
    }
}
