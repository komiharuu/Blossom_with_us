import { Injectable } from '@nestjs/common';
import { CreateSerizeDto } from './dto/create-serize.dto';
import { UpdateSerizeDto } from './dto/update-serize.dto';

@Injectable()
export class SerizesService {
  create(createSerizeDto: CreateSerizeDto) {
    return 'This action adds a new serize';
  }

  findAll() {
    return `This action returns all serizes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serize`;
  }

  update(id: number, updateSerizeDto: UpdateSerizeDto) {
    return `This action updates a #${id} serize`;
  }

  remove(id: number) {
    return `This action removes a #${id} serize`;
  }
}
