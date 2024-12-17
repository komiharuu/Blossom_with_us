export class Auth {}
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
import { SubjectType } from 'src/commons/types/subject.type';
import { MeetingArea } from 'src/commons/types/reigon.type';
import { Notice } from '../notices/notice.entity';
import { GroupChatRoom } from './group-chat-room.entity';
import { GroupMember } from './group-member.entity';
import { GroupSchedule } from './groups-schedule.entity';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  //유저 엔티티 외래키 설정
  @Column({ type: 'int', name: 'user_id', unsigned: true })
  userId: number;

  /**
   * 그룹명
   * @example "시카고와 수학자들"
   */
  @Column({ type: 'varchar', nullable: false, unique: true })
  groupName: string;

  @Column({ type: 'varchar' })
  leader: string;

  /**
   * 그룹 과목
   * @example "MATH"
   */
  @Column({
    type: 'enum',
    enum: SubjectType,
    nullable: false,
  })
  subject: SubjectType;

  /**
   * 만남 장소
   * @example "SEOUL"
   */
  @Column({ type: 'enum', enum: MeetingArea, nullable: false })
  meetingArea: MeetingArea;

  /**
   * 공연 설명
   * @example "안녕하세요! 저희는 수학 실력 향상과 함께 성장을 목표로 하고 있는 그룹입니다."
   */
  @Column({ type: 'text', nullable: false })
  groupIntroduce: string;

  /**
   * 총 정원
   * @example 5
   */
  @Column({ type: 'int', nullable: false })
  members: number;

  @Column({ type: 'int', default: 0, nullable: true })
  availableMembers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // Relation - [groups] N : 1 [users]
  @ManyToOne(() => User, (user) => user.group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  // Relation - [groups] 1 : N [notices]
  @OneToMany(() => Notice, (notice) => notice.group, { onDelete: 'CASCADE' })
  notice: Notice[];

  // Relation - [groups] 1 : N [group_schedules]
  @OneToMany(() => GroupSchedule, (groupSchedule) => groupSchedule.group, {
    onDelete: 'CASCADE',
  })
  groupSchedule: GroupSchedule[];

  // Relation - [groups] 1 : N [chatrooms]
  @OneToMany(() => GroupChatRoom, (chatroom) => chatroom.group, {
    onDelete: 'CASCADE',
  })
  groupChatRoom: GroupChatRoom[];

  // Relation - [groups] 1 : N [group_members]
  @OneToMany(() => GroupMember, (groupMember) => groupMember.group, {
    onDelete: 'CASCADE',
  })
  groupMember: GroupMember[];
}
