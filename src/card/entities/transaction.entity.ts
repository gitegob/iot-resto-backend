import { User } from 'src/auth/entities/user.entity';
import { Resto } from 'src/resto/entities/resto.entity';
import { TransactionType } from 'src/_shared_/interfaces/enums.interface';
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
  @ManyToOne(() => User, (agent) => agent.transactions)
  agent: User;
  @ManyToOne(() => Resto, (resto) => resto.cardTransactions)
  resto: Resto;
}
