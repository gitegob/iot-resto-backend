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
  @Column()
  restoname: string;
  @Column()
  restopassword: string;
  @Column({ default: true })
  active: boolean;
  @CreateDateColumn()
  addedAt: string;
}
