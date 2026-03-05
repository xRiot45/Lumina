import { IsString, IsNotEmpty, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class XenditWebhookDataDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    reference_id?: string;

    @IsString()
    @IsOptional()
    payment_request_id?: string;
}

export class XenditWebhookDto {
    @IsString()
    @IsNotEmpty()
    event!: string;

    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    external_id?: string;

    @IsString()
    @IsOptional()
    reference_id?: string;

    @IsString()
    @IsOptional()
    payment_request_id?: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => XenditWebhookDataDto)
    data?: XenditWebhookDataDto;
}

export class XenditWebhookPayloadDto {
    @IsString()
    @IsNotEmpty()
    callbackToken!: string;

    @IsObject()
    @ValidateNested()
    @Type(() => XenditWebhookDto)
    data!: XenditWebhookDto;
}
