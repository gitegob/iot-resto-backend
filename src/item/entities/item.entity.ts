import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ItemStatus } from '../../_shared_/interfaces/enum.interface';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ enum: ItemStatus, nullable: false, default: ItemStatus.AVAILABLE })
  status: ItemStatus;

  @Column({ nullable: false })
  price: number;
}
