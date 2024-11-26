import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Group } from './group.entity';
import { GroupChat } from './group-chat.entity';

@Entity({
  name: 'group_chatrooms',
})
export class GroupChatRoom {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  //유저 엔티티 외래키 설정
  @Column({ name: 'member_id', type: 'int', unsigned: true })
  memberId: number;

  //그룹 엔티티 외래키 설정
  @Column({ name: 'group_id', type: 'int', unsigned: true })
  groupId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
  // Relation - [group_chatrooms] N : 1 [groups]
  @ManyToOne(() => Group, (group) => group.groupChatRoom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  // Relation - [group_chatrooms] N : 1 [users]
  @ManyToOne(() => User, (member) => member.groupChatRoom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member: User;

  // Relation - [groupchats] 1 : N [groupchatrooms]
  @OneToMany(() => GroupChat, (groupChat) => groupChat.groupChatRoom, {
    onDelete: 'CASCADE',
  })
  groupChat: GroupChat[];
}
