import { UserRole } from '../enums/role.enum';

export interface IJwtPayload {
    sub: string;
    email: string;
    fullName: string;
    role: UserRole;
    type: 'access' | 'refresh';
}
