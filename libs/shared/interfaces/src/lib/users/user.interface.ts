import { UserRole } from '../enums/user-role.enum';

export interface IUser {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindUserByEmailPayload {
    email: string;
}
