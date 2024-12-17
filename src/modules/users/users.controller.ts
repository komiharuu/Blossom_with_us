import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { DeleteUserDto } from 'src/dtos/users/delete-users.dto';
import { UpdateUserDto } from 'src/dtos/users/update-users.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('/users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  /**
   *  내 프로필 조회
   * @param req
   * @returns
   * */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Get()
  async getUser(@Req() req: any) {
    const userId = req.user.id;
    return await this.usersService.getUser(userId);
  }

  /**
   *  회원정보 수정
   * @param req
   * @returns
   * */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Patch()
  async updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return await this.usersService.updateUser(updateUserDto, userId); // updateUserDto와 userId를 전달
  }

  /**
   *  회원 탈퇴
   * @param req
   * @returns
   * */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Delete()
  async removeUser(@Req() req: any, @Body() deleteUserDto: DeleteUserDto) {
    const userId = req.user.id;
    return await this.usersService.removeUser(deleteUserDto, userId);
  }
  /**
   * 사용자 생성 그룹 조회
   * @param req
   * @returns
   * */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Get('/groups')
  async getUserGroupList(@Req() req: any) {
    return await this.usersService.getUserGroupList(req.user);
  }
  /**
   * 사용자 가입 그룹 조회
   * @param req
   * @returns
   * */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Get('/join-groups')
  async getUserJoinGroupList(@Req() req: any) {
    return await this.usersService.getUserJoinGroupList(req.user);
  }
}
