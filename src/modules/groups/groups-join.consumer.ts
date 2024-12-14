import {
  Process,
  Processor,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueWaiting,
} from '@nestjs/bull';
import { GroupsService } from './groups.service';
import { Job } from 'bull';
import { User } from 'src/entities/users/user.entity';

@Processor('joinGroupQueue')
export class GroupsJoinConsumer {
  constructor(private readonly groupsService: GroupsService) {}

  @Process('joingroupQueue') // 'joingroupQueue'는 큐에서 처리할 작업 이름
  async handleJoinQueue(job: Job<{ groupId: number; user: User }>) {
    const { groupId, user } = job.data; // 큐에서 넘어온 데이터

    try {
      await this.groupsService.joinGroup(groupId, user);

      // 성공 메시지 반환
      return { message: '가입 성공' };
    } catch (error) {
      console.error('Error processing join group:', error);
      throw error; // 실패 시 예외 처리
    }
  }

  @OnQueueCompleted()
  handleCompleted(job: Job, result: any) {
    console.log(`Job completed: ${job.id}, Result:`, result);
  }

  // 작업 실패 이벤트
  @OnQueueFailed()
  handleFailed(job: Job, error: any) {
    console.error(`Job failed: ${job.id}, Error:`, error.message);
  }

  // 작업 대기 상태 이벤트
  @OnQueueWaiting()
  handleWaiting(jobId: string) {
    console.log(`Job is waiting: ${jobId}`);
  }
}
