import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../core/database/entities/order.entity';
import { OrderItemEntity } from '../../core/database/entities/order-item.entity';
import { LoggerModule } from '@lumina/shared-logger';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]), LoggerModule],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
