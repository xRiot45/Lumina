import { IsOptional, IsEnum } from 'class-validator';
import { PaginationDto } from '../pagination/pagination.dto';
import { OrderStatus } from '@lumina/shared-interfaces';

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(OrderStatus, {
        message: 'Invalid status. Ensure the value matches the OrderStatus enum.',
    })
    status?: OrderStatus;
}
