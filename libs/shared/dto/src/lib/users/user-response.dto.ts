import { Expose } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    id!: string;

    @Expose()
    fullName!: string;

    @Expose()
    email!: string;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;
}
