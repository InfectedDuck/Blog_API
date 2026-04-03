import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // 'like' | 'comment' | 'follow'

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User)
  recipient: User;

  @ManyToOne(() => User, { eager: true })
  actor: User;

  @CreateDateColumn()
  createdAt: Date;
}
