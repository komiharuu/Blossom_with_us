import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'accessToken') {
  // controller에 요청이 왔을 때 constructor가 실행
  constructor(private readonly configService: ConfigService) {
    super({
      // accessToken 위치
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
      expiresIn: configService.get<string>('ACCESS_EXPIRES_IN'),
    });
  }

  async validate(payload: any) {
    return { id: payload.id };
  }
}
