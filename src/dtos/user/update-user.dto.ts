import { IsNotEmpty, IsString } from 'class-validator';
import { SubjectType } from 'src/commons/types/subject.type';

export class UpdateUserDto {
  email: string;

  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  passwordConfirm: string;

  favoriteSubject: SubjectType;

  profileImg: string;

  introduce: string;
}
