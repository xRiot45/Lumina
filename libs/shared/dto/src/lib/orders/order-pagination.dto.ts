import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { PaginationDto } from '../pagination/pagination.dto';
import { OrderStatus } from '@lumina/shared-interfaces';
import { Type } from 'class-transformer';

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatus, {
        message: 'Invalid status. Ensure the value matches the OrderStatus enum.',
    })
    status?: OrderStatus;
}

export class OrderPaginationPayloadDto {
    @IsUUID()
    userId!: string;

    @IsOptional()
    @Type(() => OrderPaginationDto)
    data!: OrderPaginationDto;
}
