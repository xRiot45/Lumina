import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsEnum,
    IsBoolean,
    IsOptional,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
    ICreateUserAddressRequest,
    IUpdateUserAddressRequest,
    IUserAddressResponse,
    AddressLabel,
} from '@lumina/shared-interfaces';

export class CreateUserAddressDto implements ICreateUserAddressRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    recipientName!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    phoneNumber!: string;

    @IsEnum(AddressLabel, { message: 'Label must be a valid AddressLabel (HOME, OFFICE, APARTMENT, OTHER)' })
    @IsNotEmpty()
    label!: AddressLabel;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    province!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    city!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    district!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    postalCode!: string;

    @IsString()
    @IsNotEmpty()
    fullAddress!: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    landmark?: string;
}

export class CreateUserAddressPayloadDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsNotEmpty()
    userId!: string;

    @ValidateNested()
    @Type(() => CreateUserAddressDto)
    @IsNotEmpty()
    data!: CreateUserAddressDto;
}

export class UpdateUserAddressDto implements IUpdateUserAddressRequest {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    recipientName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    phoneNumber?: string;

    @IsEnum(AddressLabel)
    @IsOptional()
    label?: AddressLabel;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    province?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    city?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    district?: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    postalCode?: string;

    @IsString()
    @IsOptional()
    fullAddress?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    landmark?: string;
}

export class UserAddressResponseDto implements IUserAddressResponse {
    @Expose() id!: string;
    @Expose() recipientName!: string;
    @Expose() phoneNumber!: string;
    @Expose() label!: AddressLabel;
    @Expose() isDefault!: boolean;
    @Expose() province!: string;
    @Expose() city!: string;
    @Expose() district!: string;
    @Expose() postalCode!: string;
    @Expose() fullAddress!: string;
    @Expose() landmark?: string | null;
    @Expose() createdAt?: Date;
    @Expose() updatedAt?: Date;
}

export class FindOneUserAddressPayloadDto {
    @IsUUID('4', { message: 'User ID must be a valid UUID' })
    @IsNotEmpty()
    userId!: string;

    @IsUUID('4', { message: 'Address ID must be a valid UUID' })
    @IsNotEmpty()
    addressId!: string;
}
