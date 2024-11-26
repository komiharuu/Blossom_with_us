import { PartialType } from '@nestjs/swagger';
import { CreateSerizeDto } from './create-serize.dto';

export class UpdateSerizeDto extends PartialType(CreateSerizeDto) {}
