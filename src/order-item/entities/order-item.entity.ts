import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('orderItems')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Item, (item) => item.orderedItems)
  item: Item;
}
