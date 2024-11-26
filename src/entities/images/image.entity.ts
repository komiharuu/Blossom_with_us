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
import { Post } from '../posts/post.entity';
import { Notice } from '../notices/notice.entity';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  //포스트 엔티티 외래키 설정
  @Column({ type: 'int', name: 'post_id', unsigned: true, nullable: true })
  postId: number;

  //공지사항 엔티티 외래키 설정
  @Column({ type: 'int', name: 'notice_id', unsigned: true, nullable: true })
  noticeId: number;

  /**
   *  이미지
   * @example "https://example.com/image.jpg"
   */
  @Column({ type: 'varchar' })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // Relation - [images] N : 1 [posts]
  @ManyToOne(() => Post, (post) => post.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  // Relation - [images] N : 1 [notices]
  @ManyToOne(() => Notice, (notice) => notice.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'notice_id' })
  notice: Notice;
}
