import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dtos/sign-in.dto';
import { SignUpDto } from 'src/dtos/sign-up.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   *  회원가입
   * @returns
   * */
  @Post('sign-up')
  @HttpCode(201)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  /**
   *  로그인
   * @returns
   * */
  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  /**
   *  토큰 재발급
   * @param req
   * @returns
   * */ @ApiBearerAuth()
  @UseGuards(AuthGuard('refreshToken'))
  @Post('reissue')
  reissueToken(@Req() req: any) {
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    return this.authService.reissueToken(req.user.id, refreshToken);
  }

  /**
   *  로그아웃
   * @param req
   * @returns
   * */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('refreshToken'))
  @Post('sign-out')
  update(userId: number) {
    return this.authService.signOut(userId);
  }
}
