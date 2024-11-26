// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
// } from '@nestjs/websockets';
// // import { GroupChatsService } from './group-chats.service';
// import { CreateGroupChatDto } from './dto/create-group-chat.dto';
// import { UpdateGroupChatDto } from './dto/update-group-chat.dto';

// @WebSocketGateway()
// export class GroupChatsGateway {
//   // constructor(private readonly groupChatsService: GroupChatsService) {}

//   @SubscribeMessage('createGroupChat')
//   create(@MessageBody() createGroupChatDto: CreateGroupChatDto) {
//     return this.groupChatsService.create(createGroupChatDto);
//   }

//   @SubscribeMessage('findAllGroupChats')
//   findAll() {
//     return this.groupChatsService.findAll();
//   }

//   @SubscribeMessage('findOneGroupChat')
//   findOne(@MessageBody() id: number) {
//     return this.groupChatsService.findOne(id);
//   }

//   @SubscribeMessage('updateGroupChat')
//   update(@MessageBody() updateGroupChatDto: UpdateGroupChatDto) {
//     return this.groupChatsService.update(
//       updateGroupChatDto.id,
//       updateGroupChatDto,
//     );
//   }

//   @SubscribeMessage('removeGroupChat')
//   remove(@MessageBody() id: number) {
//     return this.groupChatsService.remove(id);
//   }
// }
