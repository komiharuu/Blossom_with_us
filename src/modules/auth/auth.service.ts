import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from 'src/dtos/sign-up.dto';
import { compare, hash } from 'bcrypt';
import { SignInDto } from 'src/dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  // 회원가입
  async signUp(signUpDto: SignUpDto) {
    const {
      email,
      nickname,
      password,
      passwordCheck,
      favoriteSubject,
      introduce,
    } = signUpDto;

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }

    // 닉네임 중복 확인
    const existingNickName = await this.userRepository.findOne({
      where: { nickname },
    });
    if (existingNickName) {
      throw new ConflictException('중복된 닉네임입니다.');
    }

    // 비밀번호 일치 확인
    if (password !== passwordCheck) {
      throw new ConflictException(
        '비밀번호가 일치하지 않습니다. 다시 입력해주세요.',
      );
    }

    // 비밀번호 해싱
    const hashPassword = await hash(password, 10);

    // 새로운 사용자 저장
    const newUser = await this.userRepository.save({
      email,
      nickname,
      password: hashPassword,
      favoriteSubject, // SubjectType enum 배열로 저장
      introduce,
    });

    // 비밀번호를 응답에서 삭제
    delete newUser.password;

    return newUser;
  }

  //토큰 발급
  async generateToken(userId: number) {
    const payload = { id: userId };

    // 액세스 토큰 생성
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_EXPIRES_IN'),
    });

    // 리프레시 토큰 생성
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN'),
    });

    //리프레시 토큰을 DB에 저장
    await this.userRepository.update({ id: userId }, { refreshToken });

    // 생성된 토큰 반환
    return { accessToken, refreshToken };
  }

  //로그인
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('해당 이메일을 가진 사용자가 없습니다.');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호를 다시 확인해주세요');
    }

    return await this.generateToken(user.id);
  }

  async reissueToken(userId: number, refreshToken: string) {
    // 사용자 정보 조회
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }

    // 리프레시 토큰 검증
    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    // 새로운 토큰 생성
    const newTokens = await this.generateToken(userId); // 객체 형태로 액세스 토큰과 리프레시 토큰을 반환

    // DB에 새로운 리프레시 토큰 저장
    user.refreshToken = newTokens.refreshToken;
    await this.userRepository.save(user);

    // 새로운 액세스 토큰과 리프레시 토큰 반환
    return {
      accessToken: newTokens.accessToken, // 액세스 토큰 반환
      refreshToken: newTokens.refreshToken, // 리프레시 토큰 반환
    };
  }

  async signOut(userId: number) {
    // 사용자 정보 조회
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user.refreshToken === null) {
      throw new BadRequestException('이미 로그아웃 상태입니다.');
    }

    // 로그아웃 (리프레시 토큰 제거)
    user.refreshToken = null;
    await this.userRepository.save(user);

    return {
      status: 200,
      message: '로그아웃에 성공했습니다.',
    };
  }
}
