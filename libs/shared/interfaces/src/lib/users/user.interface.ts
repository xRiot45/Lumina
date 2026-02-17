import { UserRole } from '../enums/role.enum';

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindUserPayload {
    email: string;
}
