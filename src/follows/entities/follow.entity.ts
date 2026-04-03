import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('follows')
@Unique(['follower', 'following'])
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  follower: User;

  @ManyToOne(() => User, { eager: true })
  following: User;

  @CreateDateColumn()
  createdAt: Date;
}
