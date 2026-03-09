import { IRegisterRequest } from '@lumina/shared-interfaces';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto implements IRegisterRequest {
    @IsNotEmpty()
    @IsString()
    fullName!: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!: string;
}
