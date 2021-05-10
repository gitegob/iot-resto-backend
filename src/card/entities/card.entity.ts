import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  // @OneToMany(()=>Transactions,transaction=>transaction.card)
  // transactions:Transaction[]
}
