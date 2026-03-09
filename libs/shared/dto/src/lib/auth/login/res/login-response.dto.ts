import { ILoginResponse } from '@lumina/shared-interfaces';
import { Expose } from 'class-transformer';

export class LoginResponseDto implements ILoginResponse {
    @Expose()
    accessToken?: string;
}
