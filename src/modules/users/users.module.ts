import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { Group } from 'src/entities/groups/group.entity';
import { GroupMember } from 'src/entities/groups/group-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, GroupMember])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
