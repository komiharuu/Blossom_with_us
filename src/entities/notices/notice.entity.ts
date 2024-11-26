import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { IsString, MinLength } from 'class-validator';
import { Group } from '../groups/group.entity';
import { Image } from '../images/image.entity';

@Entity({ name: 'notices' })
export class Notice {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  // 그룹 엔티티 외래키 설정
  @Column({ name: 'member_id', type: 'int', unsigned: true })
  memberId: number;

  // 그룹 엔티티 외래키 설정
  @Column({ name: 'group_id', type: 'int', unsigned: true })
  groupId: number;

  /**
   * 공지사항 제목
   * @example "공지사항"
   */
  @Column({ type: 'varchar' })
  noticeTitle: string;

  /**
   * 공지사항 내용
   * @example "즐거운 그룹을 만들어가요!"
   */
  @IsString()
  @MinLength(10, { message: '공지사항은 10자 이상으로 작성해주세요' })
  @Column({ type: 'text' })
  notice: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // Relation - [notices] N : 1 [users]
  @ManyToOne(() => User, (user) => user.notice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member: User;

  // Relation - [notices] N : 1 [groups]
  @ManyToOne(() => Group, (group) => group.notice, { onDelete: 'CASCADE' })
  group: Group;

  // Relation - [images] 1 : N [notices]
  @OneToMany(() => Image, (image) => image.notice)
  image: Image[];
}
