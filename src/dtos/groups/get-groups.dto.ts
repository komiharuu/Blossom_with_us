import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  results: TData[];

  @ApiProperty()
  lastPage: number;
}
