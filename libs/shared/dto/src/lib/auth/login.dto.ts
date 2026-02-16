import { ILoginRespose, ILoginUser } from '@lumina/shared-interfaces';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto implements ILoginUser {
    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}

export class LoginResponseDto implements ILoginRespose {
    @Expose()
    accessToken?: string;
}
