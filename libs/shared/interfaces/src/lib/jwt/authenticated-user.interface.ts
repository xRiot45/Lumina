import { UserRole } from '../enums/user-role.enum';

export interface IAuthenticatedUser {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
}
