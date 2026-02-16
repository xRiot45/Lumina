export interface IUser {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindUserPayload {
    email: string;
}
