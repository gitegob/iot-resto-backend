import { Resto } from 'src/resto/entities/resto.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/auth.entity';
import { OrderItem } from '../../order-item/entities/order-item.entity';
import { Table } from '../../table/entities/table.entity';
import { OrderStatus } from '../../_shared_/interfaces/enum.interface';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ default: 0 })
  price: number;
  @Column({ default: false })
  isPaid: boolean;
  @Column({ default: 0 })
  paidPrice: number;
  @Column({ enum: OrderStatus, default: OrderStatus.PENDING, nullable: false })
  status: OrderStatus;
  @Column({ nullable: true })
  timeConfirmed: Date;
  /**
   * time when finished - confirmed time
   */
  @Column({ nullable: true })
  timeConfirmedToServed: string;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;
  @ManyToOne(() => Table, (table) => table.orders)
  table: Table;
  @ManyToOne(() => User, (user) => user.ordersServed)
  waiter: User;
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: 'CASCADE',
  })
  orderItems: OrderItem[];

  @ManyToOne(() => Resto, (resto) => resto.orders)
  resto: Resto;
}
