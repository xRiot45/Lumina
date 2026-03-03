import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../../../core/database/entities/order.entity';
import { LessThan, Repository } from 'typeorm';
import { LoggerService } from '@lumina/shared-logger';
import { OrderStatus } from '@lumina/shared-interfaces';

@Injectable()
export class OrdersCron {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        private readonly logger: LoggerService,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async handleExpiredOrders() {
        this.logger.debug('Running cron job to check for expired orders...');

        try {
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            const expiredOrders = await this.orderRepository.find({
                where: {
                    status: OrderStatus.PENDING_PAYMENT,
                    createdAt: LessThan(oneHourAgo),
                },
            });

            if (expiredOrders.length === 0) {
                return;
            }

            this.logger.log(`Found ${expiredOrders.length} expired orders. Cancelling them...`);

            for (const order of expiredOrders) {
                order.status = OrderStatus.CANCELLED;
            }

            await this.orderRepository.save(expiredOrders);

            this.logger.log(`Successfully cancelled ${expiredOrders.length} expired orders.`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error('Failed to execute handleExpiredOrders cron job', errorMessage, errorStack);
        }
    }
}
