import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { DeleteUserDto } from 'src/dtos/users/delete-users.dto';
import { UpdateUserDto } from 'src/dtos/users/update-users.dto';
import { GroupMember } from 'src/entities/groups/group-member.entity';
import { Group } from 'src/entities/serizes/subscription.entity';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
  ) {}

  async updateUser(updateUserDto: UpdateUserDto, userId: number) {
    const {
      email,
      nickname,
      password,
      passwordConfirm,
      favoriteSubject,
      profileImg,
      introduce,
    } = updateUserDto;

    // 사용자가 존재하는지 확인
    const user = await this.userRepository.findOne({
      where: { id: userId }, // userId로 사용자를 찾습니다
    });

    if (!user) {
      throw new NotFoundException('해당하는 사용자가 없습니다.');
    }
    // // 사용자가 존재하는지 이메일을 기준으로 확인
    const existingUser = await this.userRepository.findOne({
      where: { email }, // 이메일로 검색하여 이미 존재하는 사용자가 있는지 확인
    });

    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }
    // 비밀번호 확인
    if (password !== passwordConfirm) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await hash(password, 10);

    user.password = hashedPassword;
    user.email = email;
    user.nickname = nickname;
    user.favoriteSubject = favoriteSubject;
    user.profileImg = profileImg;
    user.introduce = introduce;

    // 변경된 사용자 정보 저장
    await this.userRepository.save(user);
    // 비밀번호와 리프레시 토큰 삭제
    delete user.password;
    delete user.refreshToken;

    return user;
  }
  async removeUser(deleteUserDto: DeleteUserDto, userId: number) {
    const { deleteReason } = deleteUserDto;

    // 사용자가 탈퇴했는지 확인
    const user = await this.userRepository.findOne({
      where: { id: userId }, // userId로 사용자를 찾습니다
    });
    // 본인만 탈퇴하도록 하기 위해서 userId와 요청된 userId가 일치하는지 확인
    if (userId !== user.id) {
      throw new UnauthorizedException('사용자가 일치하지 않습니다.');
    }

    if (user.deletedAt) {
      throw new NotFoundException('이미 탈퇴한 사용자입니다.');
    }
    // deletedAt 값을 현재 시간으로 설정하여 소프트 삭제 구현
    user.deletedAt = new Date(); // 삭제된 시간으로 설정
    await this.userRepository.save(user); // 변경된 값을 저장됩니다
    return {
      message: `${deleteReason}의 이유로 탈퇴했습니다`,
    };
  }

  async getUser(userId: number) {
    // 사용자 검색
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // 사용자 없을 경우 예외 처리
    if (!user) {
      throw new NotFoundException(`사용자를 찾을 수 없습니다.`);
    }

    delete user.password;
    delete user.refreshToken;

    // `password`와 `refreshToken`을 제거한 객체만 반환
    return user;
  }

  //사용자 생성 그룹 조회
  async getUserGroupList(userId: number) {
    const groups = await this.groupRepository.find({
      where: { userId },
    });
    return groups;
  }

  //사용자 가입 그룹 조회
  async getUserJoinGroupList(req: any) {
    const userId = req.user.id;
    const joinGroups = await this.groupMemberRepository.find({
      where: { memberId: userId },
    });
    return joinGroups;
  }
}
