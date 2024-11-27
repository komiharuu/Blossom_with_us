import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { GroupChat } from '../groups/group-chat.entity';
import { Post } from '../posts/post.entity';
import { Serizes } from '../serizes/serizes.entity';
import { Comment } from '../comments/comment.entity';
import { Group } from '../groups/group.entity';
import { Provider } from 'src/commons/types/provider.type';
import { SubjectType } from 'src/commons/types/subject.type';
import { Subscription } from '../serizes/subscription.entity';
import { Notice } from '../notices/notice.entity';
import { GroupChatRoom } from '../groups/group-chat-room.entity';
import { GroupMember } from '../groups/group-member.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  /**
   * 이메일
   * @example "sample@sample.com"
   */
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해 주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;
  /**
   * 닉네임
   * @example "Dinosaur"
   */
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해 주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  nickname: string;

  /**
   * 비밀번호
   * @example "Test1234!"
   */
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  /**
   * 프로필 이미지
   * @example "https://example.com/profile.jpg"
   */
  @Column({ type: 'varchar', unique: true, nullable: true })
  profileImg: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  provider: Provider;

  /**
   * 좋아하는 과목
   * @example "MATH"
   */
  @IsNotEmpty({ message: '좋아하는 과목을 입력해주세요.' })
  @Column({
    type: 'enum',
    enum: SubjectType,
    nullable: false,
  })
  favoriteSubject: SubjectType;

  /**
   * 자기 소개
   * @example "안녕하세요! 수학을 사랑하는 학생입니다."
   */
  @IsString()
  @IsNotEmpty({ message: '자기소개를 입력해 주세요.' })
  @MinLength(10, { message: '자기소개는 10자 이상이어야 합니다.' })
  @Column({ type: 'text', nullable: false })
  introduce: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Relation - [users] 1: N [posts]
  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  // Relation - [users] 1: N [notices]
  @OneToMany(() => Notice, (notice) => notice.member)
  notice: Notice[];

  // Relation - [users] 1: N [comments]
  @OneToMany(() => Comment, (comments) => comments.user)
  comment: Comment[];

  // Relation - [users] 1: N [groups]
  @OneToMany(() => Group, (group) => group.user)
  group: Group[];

  // Relation - [users] 1: N [serizes]
  @OneToMany(() => Serizes, (serizes) => serizes.user)
  serizes: Serizes[];

  // Relation - [users] 1: N [subscriptions]
  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscription: Subscription[];

  // Relation [users] 1 : N [group_chatrooms]

  @OneToMany(() => GroupChatRoom, (groupChatRoom) => groupChatRoom.member)
  groupChatRoom: GroupChatRoom[];

  // Relation [users] 1 : N [groupchats]
  @OneToMany(() => GroupChat, (groupChat) => groupChat.member)
  groupChat: GroupChat[];

  // Relation [users] 1 : N [groupmembers]
  @OneToMany(() => GroupMember, (groupmember) => groupmember.user)
  groupMembers: GroupMember[];
}
