import { IsString, IsNotEmpty, IsObject, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// DTO untuk objek "data" di dalam payload Xendit
export class XenditWebhookDataDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    reference_id?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    currency?: string;
}

export class XenditWebhookDto {
    // --- Properti Umum (V3) ---
    @IsString()
    @IsOptional()
    event?: string;

    @IsString()
    @IsOptional()
    business_id?: string;

    @IsString()
    @IsOptional()
    created?: string;

    // --- Objek Nested (V3) ---
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => XenditWebhookDataDto)
    data?: XenditWebhookDataDto;

    // --- Properti Root Level (Khusus V2 / payment.succeeded) ---
    @IsString()
    @IsOptional()
    id?: string; // ID transaksi di V2

    @IsString()
    @IsOptional()
    external_id?: string; // Ini adalah reference_id (orderId) di V2

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    payment_method?: string;
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
