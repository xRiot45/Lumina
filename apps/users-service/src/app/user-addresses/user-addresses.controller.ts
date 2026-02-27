import { Controller } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    CreateUserAddressPayloadDto,
    FindOneUserAddressPayloadDto,
    SetDefaultUserAddressPayloadDto,
    UpdateUserAddressPayloadDto,
    UserAddressResponseDto,
} from '@lumina/shared-dto';

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

    @MessagePattern({ cmd: 'update_user_address' })
    async update(@Payload() payload: UpdateUserAddressPayloadDto): Promise<UserAddressResponseDto> {
        return await this.userAddressesService.update(payload?.userId, payload?.addressId, payload?.data);
    }

    @MessagePattern({ cmd: 'set_default_user_address' })
    async setDefault(@Payload() payload: SetDefaultUserAddressPayloadDto): Promise<UserAddressResponseDto> {
        return await this.userAddressesService.setDefault(payload?.userId, payload?.addressId);
    }
}
