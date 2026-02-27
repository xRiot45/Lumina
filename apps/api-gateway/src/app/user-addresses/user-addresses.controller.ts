import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, Roles } from '@lumina/shared-common';
import { UserRole } from '@lumina/shared-interfaces';
import type { IAuthenticatedUser } from '@lumina/shared-interfaces';
import { BaseResponseDto, CreateUserAddressDto, UserAddressResponseDto } from '@lumina/shared-dto';

@Controller('user-addresses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserAddressesController {
    constructor(private readonly userAddressesService: UserAddressesService) {}

    @Post()
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
}
