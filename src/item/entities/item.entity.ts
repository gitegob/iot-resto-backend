import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from '../../order-item/entities/order-item.entity';
import { ItemStatus } from '../../_shared_/interfaces/enum.interface';
@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ default: 'None' })
  description: string;

  @Column({ enum: ItemStatus, nullable: false, default: ItemStatus.AVAILABLE })
  status: ItemStatus;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: true })
  picture: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.item)
  orderedItems: OrderItem[];
}
