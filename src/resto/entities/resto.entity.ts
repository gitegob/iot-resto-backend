import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('restos')
export class Resto {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ unique: true })
  name: string;
  @Column()
  password: string;
  @Column({ default: true })
  active: boolean;
  @CreateDateColumn()
  addedAt: string;
}
