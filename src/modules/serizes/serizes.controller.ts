import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SerizesService } from './serizes.service';
import { CreateSerizeDto } from './dto/create-serize.dto';
import { UpdateSerizeDto } from './dto/update-serize.dto';

@Controller('serizes')
export class SerizesController {
  constructor(private readonly serizesService: SerizesService) {}

  @Post()
  create(@Body() createSerizeDto: CreateSerizeDto) {
    return this.serizesService.create(createSerizeDto);
  }

  @Get()
  findAll() {
    return this.serizesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serizesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSerizeDto: UpdateSerizeDto) {
    return this.serizesService.update(+id, updateSerizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serizesService.remove(+id);
  }
}
