import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, Roles } from '@lumina/shared-common';
import { UserRole } from '@lumina/shared-interfaces';
import type { IAuthenticatedUser } from '@lumina/shared-interfaces';
import {
    BaseResponseDto,
    CreateUserAddressDto,
    UpdateUserAddressDto,
    UserAddressResponseDto,
} from '@lumina/shared-dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserAddressesController {
    constructor(private readonly userAddressesService: UserAddressesService) {}

    @Post('addresses')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser() user: IAuthenticatedUser,
        @Body() dto: CreateUserAddressDto,
    ): Promise<BaseResponseDto<UserAddressResponseDto>> {
        const result = await this.userAddressesService.create(user?.id, dto);
        return {
            success: true,
            statusCode: HttpStatus.CREATED,
            timestamp: new Date(),
            message: 'User address created successfully',
            data: result,
        };
    }

    @Get('addresses')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async findAll(@CurrentUser() user: IAuthenticatedUser): Promise<BaseResponseDto<UserAddressResponseDto[]>> {
        const result = await this.userAddressesService.findAll(user?.id);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'User addresses found successfully',
            data: result,
        };
    }

    @Get('addresses/:addressId')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @CurrentUser() user: IAuthenticatedUser,
        @Param('addressId') addressId: string,
    ): Promise<BaseResponseDto<UserAddressResponseDto>> {
        const result = await this.userAddressesService.findOne(user?.id, addressId);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'User address found successfully',
            data: result,
        };
    }

    @Patch('addresses/:addressId')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async update(
        @CurrentUser() user: IAuthenticatedUser,
        @Param('addressId') addressId: string,
        @Body() dto: UpdateUserAddressDto,
    ): Promise<BaseResponseDto<UserAddressResponseDto>> {
        const result = await this.userAddressesService.update(user?.id, addressId, dto);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'User address updated successfully',
            data: result,
        };
    }
    @Patch('addresses/:addressId/set-default')
    @Roles(UserRole.CUSTOMER)
    @HttpCode(HttpStatus.OK)
    async setDefault(
        @CurrentUser() user: IAuthenticatedUser,
        @Param('addressId') addressId: string,
    ): Promise<BaseResponseDto<UserAddressResponseDto>> {
        const result = await this.userAddressesService.setDefault(user?.id, addressId);
        return {
            success: true,
            statusCode: HttpStatus.OK,
            timestamp: new Date(),
            message: 'User address set as default successfully',
            data: result,
        };
    }
}
