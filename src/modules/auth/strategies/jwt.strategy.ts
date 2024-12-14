import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'accessToken') {
  // controller에 요청이 왔을 때 constructor가 실행
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    super({
      // accessToken 위치
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
      expiresIn: configService.get<string>('ACCESS_EXPIRES_IN'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new NotFoundException('인증에 실패하였습니다');
    }

    return user;
  }
}
