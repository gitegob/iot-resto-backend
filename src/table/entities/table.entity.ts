import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { TableStatus } from '../../_shared_/interfaces/enum.interface';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  number: number;

  @Column({ enum: TableStatus, nullable: false, default: TableStatus.FREE })
  status: TableStatus;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];
}
