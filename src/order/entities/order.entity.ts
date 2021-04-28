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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: 'CASCADE',
  })
  items: OrderItem[];

  @Column({ default: 0 })
  price: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ default: 0 })
  paidPrice: number;

  @Column({ enum: OrderStatus, default: OrderStatus.PENDING, nullable: false })
  status: OrderStatus;

  /**
   * time when accepted - created time
   */
  @Column({ nullable: true })
  timeCreatedToAccepted: string;

  @Column({ nullable: true })
  timeConfirmed: Date;

  /**
   * time when finished - confirmed time
   */
  @Column({ nullable: true })
  timeConfirmedToFinished: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;
}
