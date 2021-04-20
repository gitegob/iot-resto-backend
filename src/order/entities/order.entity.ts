import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from '../../order-item/entities/order-item.entity';
import { Table } from '../../table/entities/table.entity';
import { OrderStatus } from '../../_shared_/interfaces/enum.interface';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Table, (table) => table.orders)
  table: Table;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column({ enum: OrderStatus, default: OrderStatus.PENDING, nullable: false })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
