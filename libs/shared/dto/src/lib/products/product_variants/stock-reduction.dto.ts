import { IsArray, IsNumber, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IReduceStockEvent, IStockReductionItem } from '@lumina/shared-interfaces';

export class StockReductionItemDto implements IStockReductionItem {
    @IsString()
    productId!: string;

    @IsString()
    variantId!: string;

    @IsNumber()
    @Min(1, { message: 'Quantity minimal 1' })
    quantity!: number;
}

export class ReduceStockEventDto implements IReduceStockEvent {
    @IsString()
    orderId!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StockReductionItemDto)
    items!: StockReductionItemDto[];
}
