import { Resto } from 'src/resto/entities/resto.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { TableStatus } from '../../_shared_/interfaces/enum.interface';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, unique: true })
  number: number;

  @Column({ enum: TableStatus, nullable: false, default: TableStatus.FREE })
  status: TableStatus;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];

  @ManyToOne(() => Resto, (resto) => resto.tables)
  resto: Resto;
}
