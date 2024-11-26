import { IsEnum, IsString, MinLength } from 'class-validator';
import { User } from '../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { SubjectType } from 'src/commons/types/subject.type';
import { Post } from '../posts/post.entity';
import { Subscription } from './subscription.entity';

@Entity('serizes')
export class Serizes {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', name: 'user_id', unsigned: true })
  userId: number;

  /**
   * 시리즈 제목
   * @example "시카고"
   */
  @Column({ type: 'varchar', nullable: false })
  serizesTitle: string;
  /**
   * 타이틀 이미지
   * @example "https://example.com/profile.jpg"
   */
  @Column({ type: 'varchar', unique: true, nullable: true })
  titleImg: string;
  /**
   * 시리즈 내용
   * @example "시카고는 무엇을 할까?"
   */
  @IsString()
  @MinLength(10, { message: '시리즈 내용은 10자 이상으로 작성해주세요' })
  @Column({ type: 'text', nullable: false })
  content: string;

  /**
   * 시리즈 과목
   * @example "MATH"
   */
  @IsEnum(SubjectType)
  @Column({
    type: 'enum',
    enum: SubjectType,
    nullable: false,
  })
  subject: SubjectType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.serizes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relation - [serizes] 1 : N [posts]
  @OneToMany(() => Post, (post) => post.serize, { onDelete: 'CASCADE' })
  posts: Post[];

  // Relation - [serizes] 1 : N [subscriptions]
  @OneToMany(() => Subscription, (subscription) => subscription.serizes, {
    onDelete: 'CASCADE',
  })
  subscriptions: Subscription[];
}
