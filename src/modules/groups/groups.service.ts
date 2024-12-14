import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from 'src/dtos/groups/create-group.dto';
import { UpdateGroupDto } from '../../dtos/groups/update-group.dto';
// import { JoinGroupDto } from 'src/dtos/groups/join-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/entities/groups/group.entity';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import { GroupMember } from 'src/entities/groups/group-member.entity';
import { MemberType } from 'src/commons/types/group.type';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { PaginatedDto } from 'src/dtos/groups/get-groups.dto';
import { User } from 'src/entities/users/user.entity';
import { GroupSchedule } from 'src/entities/groups/groups-schedule.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupSchedule)
    private readonly groupScheduleRepository: Repository<GroupSchedule>,
    private dataSource: DataSource,
    @InjectQueue('joinGroupQueue') private joinQueue: Queue,
  ) {}
  async createGroup(createGroupDto: CreateGroupDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const {
      groupName,
      subject,
      meetingArea,
      groupIntroduce,
      members,
      groupSchedules,
    } = createGroupDto;

    try {
      // 그룹 이름 중복 확인
      const existingGroup = await queryRunner.manager.findOne(Group, {
        where: { groupName },
      });

      if (existingGroup) {
        throw new ConflictException('이미 존재하는 그룹 이름입니다.');
      }
      for (const schedule of groupSchedules) {
        // 각 스케줄에 대해 중복 체크
        const existingSchedule = await queryRunner.manager.findOne(
          GroupSchedule,
          {
            where: {
              meetingDay: schedule.meetingDay, // 요일
              startTime: LessThan(schedule.endTime), // 새로운 스케줄의 종료 시간보다 기존 스케줄의 시작 시간이 이른지
              endTime: MoreThan(schedule.startTime),
              leaderId: user.id,
            },
          },
        );

        // 이미 해당 요일과 시간에 그룹이 있으면 중복 예외 처리
        if (existingSchedule) {
          throw new ConflictException(
            '이미 해당 요일과 시간에 만든 그룹이 있습니다.',
          );
        }
      }

      // 새로운 그룹 생성
      const newGroup = queryRunner.manager.create(Group, {
        userId: user.id,
        groupName,
        leader: user.nickname,
        subject,
        meetingArea,
        groupIntroduce,
        members,
        availableMembers: members - 1,
      });

      await queryRunner.manager.save(Group, newGroup);

      // 그룹 스케줄 생성
      const newGroupSchedules = groupSchedules.map((schedule) =>
        queryRunner.manager.create(GroupSchedule, {
          groupId: newGroup.id,
          meetingDay: schedule.meetingDay,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          leaderId: user.id,
        }),
      );

      await queryRunner.manager.save(GroupSchedule, newGroupSchedules);

      // 리더 그룹 멤버 생성
      const leader = queryRunner.manager.create(GroupMember, {
        groupId: newGroup.id,
        memberId: newGroup.userId,
        type: MemberType.LEADER,
      });

      await queryRunner.manager.save(GroupMember, leader);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // 새로 생성된 그룹과 그룹 스케줄 반환
      return { newGroup, newGroupSchedules }; // newGroup과 newGroupSchedules 반환
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getGroups(page: number, take: number): Promise<PaginatedDto<any>> {
    const skip = (page - 1) * take;

    const [results, total] = await this.groupRepository.findAndCount({
      where: {
        deletedAt: null,
        availableMembers: MoreThan(0),
      },
      take,
      skip,
    });

    const groups = {
      total,
      take,
      skip,
      results,
      lastPage: Math.ceil(total / take),
    };
    return groups;
  }

  async getGroup(groupId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException('해당 그룹을 찾을 수 없습니다.');
    }
    return group;
  }

  async updateGroup(groupId: number, updateGroupDto: UpdateGroupDto, req: any) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException('그룹이 존재하지 않습니다.');

    // 그룹 리더가 맞는지 검증
    if (group.userId !== req.user.id) {
      throw new NotFoundException('그룹 정보를 수정할 권한이 없습니다.');
    }
    // 그룹이 존재하는지 검증
    if (!group) {
      throw new NotFoundException('그룹이 존재하지 않습니다.');
    }

    const newGroup = await this.groupRepository.save({
      ...group,
      ...updateGroupDto,
    });
    return newGroup;
  }

  async removeGroup(groupId: number, req: any) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException('그룹이 존재하지 않습니다.');
    }

    // 그룹 리더가 맞는지 검증
    if (group.userId !== req.user.id) {
      throw new NotFoundException('해당 그룹을 삭제할 권한이 없습니다.');
    }

    group.deletedAt = new Date();
  }

  //큐에 작업 추가하는 함수
  async joinGroupQueue(groupId: number, user: User) {
    const job = await this.joinQueue.add(
      'joingroupQueue',
      { groupId, user }, // 작업 데이터
      {
        removeOnComplete: true, // 작업 완료 후 큐에서 자동 제거
        removeOnFail: true, // 작업 실패 후 큐에서 자동 제거
      },
    );

    return job;
  }

  async joinGroup(groupId: number, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 그룹이 있는지 확인
      const group = await queryRunner.manager.findOne(Group, {
        where: { id: groupId },
      });

      if (!group) {
        throw new NotFoundException('해당 그룹을 찾을 수 없습니다.');
      }

      // 가입 정원이 있는지 확인
      let availableMembers = group.availableMembers;

      if (availableMembers === 0) {
        throw new ConflictException('가입 정원이 부족합니다.');
      }

      // 이미 가입한 그룹인지 확인
      const groupCount = await this.groupMemberRepository
        .createQueryBuilder('group_members')
        .where('group_members.memberId = :memberId', { memberId: user.id })
        .andWhere('group_members.groupId = :groupId', { groupId })
        .getCount();

      if (groupCount === 1) {
        throw new ConflictException('이미 가입한 그룹입니다.');
      }

      // 그룹 정원 감소
      availableMembers -= 1;
      group.availableMembers = availableMembers;
      await queryRunner.manager.save(Group, group);

      // 그룹 멤버 기록 생성
      const newMember = queryRunner.manager.create(GroupMember, {
        groupId: group.id,
        memberId: user.id,
        type: MemberType.MEMBER,
      });

      await queryRunner.manager.save(GroupMember, newMember);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction(); // 커밋 처리
    } catch (error) {
      await queryRunner.rollbackTransaction(); // 오류 발생 시 롤백
      throw error;
    } finally {
      await queryRunner.release(); // 트랜잭션 자원 해제
    }
  }
  // // 그룹 탈퇴
  // async leaveGroup(groupId: number, req: any) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     // 그룹이 있는지 확인합니다.
  //     const group = await queryRunner.manager.findOne(Group, {
  //       where: { id: groupId },
  //     });

  //     if (!group) {
  //       throw new NotFoundException('해당 그룹을 찾을 수 없습니다.');
  //     }

  //     // 그룹 멤버 증가
  //     group.availableMembers += 1;
  //     await queryRunner.manager.save(Group, group);

  //     // 그룹멤버 삭제 처리
  //     const leaveMember = await queryRunner.manager.update(
  //       GroupMember,
  //       { memberId: req.user.id },
  //       { deletedAt: new Date() }, // 삭제 시간을 현재 시간으로 설정
  //     );
  //     await queryRunner.manager.save(leaveMember);

  //     // 삭제된 멤버의 수 반환 (예: deleteResult.affected로 확인 가능)
  //     await queryRunner.commitTransaction();
  //     await queryRunner.release();

  //     // 삭제된 멤버 수 또는 삭제 결과 반환
  //     return {
  //       message: '그룹에서 성공적으로 탈퇴되었습니다.',
  //     };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     await queryRunner.release();
  //     throw error;
  //   }
  // }
}
