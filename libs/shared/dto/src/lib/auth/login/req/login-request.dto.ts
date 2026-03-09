import { ILoginRequest } from '@lumina/shared-interfaces';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto implements ILoginRequest {
    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}
