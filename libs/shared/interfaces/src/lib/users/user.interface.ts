import { RoleEnum } from '../enums/role.enum';

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    role: RoleEnum;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindUserPayload {
    email: string;
}
