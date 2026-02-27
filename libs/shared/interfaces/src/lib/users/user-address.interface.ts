import { AddressLabel } from '../enums/address-label.enum';

export interface ICreateUserAddressRequest {
    recipientName: string;
    phoneNumber: string;
    label: AddressLabel;
    isDefault?: boolean;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    fullAddress: string;
    landmark?: string;
}

export type IUpdateUserAddressRequest = Partial<ICreateUserAddressRequest>;

export interface IUserAddressResponse {
    id: string;
    userId: string;
    recipientName: string;
    phoneNumber: string;
    label: AddressLabel;
    isDefault: boolean;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    fullAddress: string;
    landmark?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateUserAddressPayload {
    userId: string;
    data: ICreateUserAddressRequest;
}

export interface IUpdateUserAddressPayload {
    userId: string;
    addressId: string;
    data: IUpdateUserAddressRequest;
}

export interface IDeleteUserAddressPayload {
    userId: string;
    addressId: string;
}
