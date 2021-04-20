import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { Order } from '../order/order.entity';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  number: number;

  //   @OneToMany(() => Order, (order) => order.table)
  //   orders: Order[];
}
