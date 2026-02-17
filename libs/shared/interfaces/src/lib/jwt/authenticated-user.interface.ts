import { RoleEnum } from '../enums/role.enum';

export interface IAuthenticatedUser {
    id: string;
    email: string;
    fullName: string;
    role: RoleEnum;
}
