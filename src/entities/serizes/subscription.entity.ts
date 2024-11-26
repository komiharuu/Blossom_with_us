export class Group {}
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Serizes } from './serizes.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  @Column({ type: 'int', name: 'user_id', unsigned: true })
  userId: number;

  @Column({ type: 'int', name: 'serize_id', unsigned: true })
  serizeId: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relation - [users] N : 1 [subscriptions]
  @ManyToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relation - [serizes] N : 1 [subscriptions]
  @ManyToOne(() => Serizes, (serizes) => serizes.subscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serize_id' })
  serizes: Serizes;
}
