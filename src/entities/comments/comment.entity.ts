import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  //유저 엔티티 외래키 설정
  @Column({ unsigned: true, type: 'int', name: 'user_id' })
  user_id: number;

  /**
   * 모임 날짜
   * @example "잘 읽고 갑니다"
   */
  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;
}
