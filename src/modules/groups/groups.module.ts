import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { Group } from 'src/entities/groups/group.entity';
import { GroupMember } from 'src/entities/groups/group-member.entity';
import { GroupsJoinConsumer } from './groups-join.consumer';
import { GroupSchedule } from 'src/entities/groups/groups-schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Group, GroupMember, GroupSchedule]),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: 'joinGroupQueue',
    }),
  ],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsJoinConsumer],
})
export class GroupsModule {}
