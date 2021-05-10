import { TransactionType } from 'src/_shared_/interfaces/enum.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from './card.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  cardUid: string;
  @Column()
  type: TransactionType;
  @Column()
  amount: number;
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
  @ManyToOne(() => Card, (card) => card.transactions)
  card: Card;
}
