import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Table } from '../../table/entities/table.entity';
import { OrderStatus } from '../../_shared_/interfaces/enum.interface';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Table, (table) => table.orders)
  table: Table;

  @Column({ enum: OrderStatus, default: OrderStatus.PENDING, nullable: false })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
