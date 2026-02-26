import { Entity } from 'typeorm';
import { BaseEntity } from '@lumina/shared-entities';

@Entity('orders')
export class OrderEntity extends BaseEntity {}
