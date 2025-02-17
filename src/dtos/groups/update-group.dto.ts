import { PickType } from '@nestjs/swagger';
import { Day } from 'src/commons/types/day.type';
import { MeetingArea } from 'src/commons/types/reigon.type';
import { SubjectType } from 'src/commons/types/subject.type';
import { Group } from 'src/entities/groups/group.entity';
import { CreateScheduleDto } from './create-schedule.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGroupDto extends PickType(Group, [
  'groupName',
  'subject',
  'meetingArea',
  'groupIntroduce',
  'members',
]) {
  groupName: string;

  subject: SubjectType;

  meetingArea: MeetingArea;

  meetingDay: Day;

  groupIntroduce: string;

  startTime: string;

  endTime: string;

  members: number;

  @ValidateNested()
  @Type(() => CreateScheduleDto)
  groupSchedules: CreateScheduleDto[];
}
