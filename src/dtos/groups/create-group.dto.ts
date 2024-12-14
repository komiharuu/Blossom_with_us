import { PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { MeetingArea } from 'src/commons/types/reigon.type';
import { SubjectType } from 'src/commons/types/subject.type';
import { Group } from 'src/entities/groups/group.entity';
import { CreateScheduleDto } from './create-schedule.dto';
import { Type } from 'class-transformer';

export class CreateGroupDto extends PickType(Group, [
  'groupName',
  'subject',
  'meetingArea',
  'groupIntroduce',
  'members',
]) {
  @IsNotEmpty({ message: '그룹 이름을 입력해 주세요' })
  @IsString({ message: '' })
  groupName: string;

  @IsEnum(SubjectType)
  @IsNotEmpty({ message: '그룹 과목을 입력해 주세요' })
  subject: SubjectType;

  @IsEnum(MeetingArea)
  @IsNotEmpty({ message: '모임 장소를 입력해 주세요' })
  meetingArea: MeetingArea;

  @IsString()
  @MinLength(10, { message: '그룹 설명은 10자 이상으로 작성해주세요' })
  @IsNotEmpty({ message: '그룹 설명을 입력해주세요' })
  groupIntroduce: string;

  @IsNumber()
  @IsNotEmpty({ message: '그룹 총 인원수를 입력해주세요' })
  members: number;

  @IsArray()
  @ValidateNested()
  @Type(() => CreateScheduleDto)
  groupSchedules: CreateScheduleDto[];
}
