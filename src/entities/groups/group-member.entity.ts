import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { MemberType } from 'src/commons/types/group.type';
import { Group } from './group.entity';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  // 유저 엔티티 외래키 설정
  @Column({ type: 'int', name: 'group_id', unsigned: true })
  groupId: number;

  // 유저 엔티티 외래키 설정
  @Column({ type: 'int', name: 'member_id', unsigned: true })
  memberId: number;

  @Column({ type: 'enum', enum: MemberType, default: MemberType.MEMBER })
  type: MemberType;

  @CreateDateColumn()
  createdAt: Date;

  // Relation - [group_members] N : 1 [users]
  @ManyToOne(() => User, (user) => user.groupMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  user: User;

  // Relation - [group_members] N : 1 [groups]
  @ManyToOne(() => Group, (group) => group.groupMember, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
