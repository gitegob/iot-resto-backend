import { User } from 'src/auth/entities/user.entity';
import { Card } from 'src/card/entities/card.entity';
import { Transaction } from 'src/card/entities/transaction.entity';
import { Item } from 'src/item/entities/item.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { Table } from 'src/table/entities/table.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('restos')
export class Resto {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ unique: true })
  name: string;
  @Column()
  password: string;
  @Column({ default: true })
  active: boolean;
  @CreateDateColumn()
  addedAt: string;

  @OneToMany(() => User, (user) => user.resto)
  users: User[];

  @OneToMany(() => Table, (table) => table.resto)
  tables: Table[];

  @OneToMany(() => Item, (item) => item.resto)
  items: Item[];

  @OneToMany(() => Order, (order) => order.resto)
  orders: Order[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.resto)
  orderItems: OrderItem[];

  @OneToMany(() => Card, (card) => card.resto)
  cards: Card[];

  @OneToMany(() => Transaction, (transaction) => transaction.resto)
  cardTransactions: Transaction[];
}
