import { IsString, IsNotEmpty, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { IXenditWebhookData, IXenditWebhookPayload } from '@lumina/shared-interfaces';

// DTO untuk objek "data" di dalam payload Xendit
export class XenditWebhookDataDto implements IXenditWebhookData {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    reference_id!: string;

    @IsString()
    @IsNotEmpty()
    status!: string;

    @IsNumber()
    @IsNotEmpty()
    amount!: number;

    @IsString()
    @IsNotEmpty()
    currency!: string;
}

export class XenditWebhookDto implements IXenditWebhookPayload {
    @IsString()
    @IsNotEmpty()
    event!: string;

    @IsString()
    @IsNotEmpty()
    business_id!: string;

    @IsString()
    @IsNotEmpty()
    created!: string;

    @IsObject()
    @ValidateNested()
    @Type(() => XenditWebhookDataDto)
    data!: XenditWebhookDataDto;
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
