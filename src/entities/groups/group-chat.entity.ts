import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { IsString } from 'class-validator';
import { GroupChatRoom } from './group-chat-room.entity';

@Entity({
  name: 'group_chats',
})
export class GroupChat {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  //유저 엔티티 외래키 설정
  @Column({ name: 'member_id', type: 'int', unsigned: true })
  memberId: number;

  //채팅방 엔티티 외래키 설정
  @Column({ name: 'chatroom_id', type: 'int', unsigned: true })
  chatroomId: number;
  /**
   * 채팅
   * @example "안녕하세요!"
   */
  @IsString()
  @Column({ type: 'text' })
  chat: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relation - [groupchats] N : 1 [users]
  @ManyToOne(() => User, (member) => member.groupChat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  member: User;

  // Relation - [groupchats] N : 1 [groupchatrooms]
  @ManyToOne(() => GroupChatRoom, (chatroom) => chatroom.groupChat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatroom_id', referencedColumnName: 'id' })
  groupChatRoom: GroupChatRoom;
}
