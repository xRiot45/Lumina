export interface IJwtPayload {
    sub: string;
    email: string;
    fullName: string;
    type: 'access' | 'refresh';
}
