import { RoleEnum } from '@lumina/shared-common';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    id!: string;

    @Expose()
    fullName!: string;

    @Expose()
    email!: string;

    @Exclude()
    password!: string;

    @Expose()
    role!: RoleEnum;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;
}
