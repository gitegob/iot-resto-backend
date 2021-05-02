import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('orderItems')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: 0 })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => Item, (item) => item.orderedItems)
  item: Item;
}
