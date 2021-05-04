import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Role } from '../../_shared_/interfaces/enum.interface';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
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
}
