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
import { DeleteUserDto } from '../../dtos/user/delete-user.dto';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
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
  getUser(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.getUser(userId);
  }

  /**
   *  회원정보 수정
   * @param req
   * @returns
   * */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Patch()
  updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.usersService.updateUser(updateUserDto, userId); // updateUserDto와 userId를 전달
  }

  /**
   *  회원 탈퇴
   * @param req
   * @returns
   * */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Delete()
  removeUser(@Req() req: any, @Body() deleteUserDto: DeleteUserDto) {
    const userId = req.user.id;
    return this.usersService.removeUser(deleteUserDto, userId);
  }
}
