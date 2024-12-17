import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from '../../dtos/groups/create-group.dto';
import { UpdateGroupDto } from '../../dtos/groups/update-group.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  /**
   *  그룹 생성
   * @param createGroupDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: any) {
    return await this.groupsService.createGroup(createGroupDto, req.user);
  }

  /**
   *  그룹 전체 조회
   * @returns
   */
  @Get()
  async getGroups(
    @Query('page') page: number = 1,
    @Query('take') take: number = 5,
  ): Promise<any> {
    if (page < 1) {
      page = 1; // 기본값 보장
    }
    if (take < 1) {
      take = 5;
    }
    return await this.groupsService.getGroups(page, take);
  }

  /**
   *  그룹 상세 조회
   * @param groupId
   * @returns
   */
  @Get(':groupId')
  async getGroup(@Param('groupId') groupId: number) {
    return await this.groupsService.getGroup(groupId);
  }

  /**
   *  그룹 수정
   * @param groupId
   * @param updateGroupDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Patch(':groupId')
  async updateGroup(
    @Param('groupId') groupId: number,
    @Body() updateGroupDto: UpdateGroupDto,
    @Req() req: any,
  ) {
    return await this.groupsService.updateGroup(
      groupId,
      updateGroupDto,
      req.user,
    );
  }

  /**
   *  그룹 삭제
   * @param groupId
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('accessToken'))
  @Delete(':groupId')
  async removeGroup(@Param('groupId') groupId: number, @Req() req: any) {
    return await this.groupsService.removeGroup(groupId, req);
  }

  /**
   *  그룹 가입
   * @param groupId
   * @returns
   */
  @Post(':groupId/join')
  @UseGuards(AuthGuard('accessToken'))
  async joinGroup(@Param('groupId') groupId: number, @Req() req: any) {
    const user = req.user;
    await this.groupsService.joinGroupQueue(groupId, user);
    return {
      message: '가입 결과는 마이 페이지에서 확인 가능합니다',
    };
  }

  // /**
  //  *  그룹 탈퇴
  //  * @param groupId
  //  * @returns
  //  */
  // @Post(':groupId/leave')
  // async leaveGroup(@Param('groupId') groupId: number, @Req() req: any) {
  //   return await this.groupsService.leaveGroup(groupId, req);
  // }
}
