import { Exclude } from 'class-transformer';
import { Transaction } from 'src/card/entities/transaction.entity';
import { Resto } from 'src/resto/entities/resto.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Role } from '../../_shared_/interfaces/enums.interface';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column()
  role: Role;
  @Column({ default: true })
  active: boolean;
  @OneToMany(() => Order, (order) => order.waiter)
  ordersServed: Order[];
  @ManyToOne(() => Resto, (resto) => resto.users)
  resto: Resto;
  @OneToMany(() => Transaction, (transaction) => transaction.agent)
  transactions: Transaction[];
}
