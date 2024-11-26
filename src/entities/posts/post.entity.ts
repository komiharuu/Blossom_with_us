import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/user.entity';
import { Serizes } from '../serizes/serizes.entity';
import { Image } from '../images/image.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'serize_id', nullable: false })
  serizeId: number;
  /**
   * 포스트 이름
   * @example "삼각함수"
   */
  @Column({ type: 'varchar', nullable: false })
  postTitle: string;
  /**
   * 포스트 설명
   * @example "오늘은 삼각함수에 대한 정리를 해보겠습니다"
   */
  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // Relation - [comments] 1: N [posts]
  @OneToMany(() => Comment, (comments) => comments.post, { cascade: true })
  comments: Comment[];

  // Relation - [serizes] N : 1 [posts]
  @ManyToOne(() => Serizes, (serize) => serize.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serize_id' })
  serize: Serizes;
  // Relation - [users] N : 1 [posts]
  @ManyToOne(() => User, (user) => user.post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relation - [images] 1: N [posts]
  @OneToMany(() => Image, (image) => image.post, { cascade: true })
  image: Image[];
}
