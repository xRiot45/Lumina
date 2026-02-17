import { RoleEnum } from '../enums/role.enum';

export interface IJwtPayload {
    sub: string;
    email: string;
    fullName: string;
    role: RoleEnum;
    type: 'access' | 'refresh';
}
