import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities/users/user.entity';

export class SignUpDto extends PickType(User, [
  'email',
  'password',
  'nickname',
  'favoriteSubject',
  'introduce',
]) {
  /**
   * 비밀번호 확인
   * @example "Test1234!"
   */
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 다시 입력해주세요' })
  passwordConfirm: string;

  profileImg: string;
}
