export class Auth {}
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
import { Day } from 'src/commons/types/day.type';

import { Group } from './group.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'group_schedules' })
export class GroupSchedule {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  //그룹 엔티티 외래키 설정
  @Column({ type: 'int', name: 'group_id', unsigned: true })
  groupId: number;

  // 유저 엔티티 외래키 설정
  @Column({ type: 'int', name: 'leader_id', unsigned: true })
  leaderId: number;

  /**
   * 모임 날짜
   * @example "MON"
   */
  @Column({ type: 'enum', enum: Day, nullable: false })
  meetingDay: Day;

  /**
   * 시작 시간
   * @example "14:30"
   */
  @Column({ type: 'time' })
  startTime: string;

  /**
   * 종료 시간
   * @example "16:30"
   */
  @Column({ type: 'time' })
  endTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // Relation - [group_schedules] 1 : N [groups]
  @ManyToOne(() => Group, (group) => group.groupSchedule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  // Relation - [group_schedules] 1 : N [users]
  @ManyToOne(() => User, (user) => user.groupSchedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'leader_id' })
  user: User;
}
