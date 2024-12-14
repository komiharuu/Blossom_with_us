import { PickType } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { Day } from 'src/commons/types/day.type';
import { GroupSchedule } from 'src/entities/groups/groups-schedule.entity';

export class CreateScheduleDto extends PickType(GroupSchedule, [
  'meetingDay',
  'startTime',
  'endTime',
]) {
  @IsEnum(Day)
  @IsNotEmpty()
  meetingDay: Day;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}
