import { Resto } from 'src/resto/entities/resto.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  owner: string;
  @Column()
  uid: string;
  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transactions: Transaction[];

  @ManyToOne(() => Resto, (resto) => resto.cards)
  resto: Resto;
}
