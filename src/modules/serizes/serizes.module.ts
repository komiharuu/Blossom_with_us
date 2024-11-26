import { Module } from '@nestjs/common';
import { SerizesService } from './serizes.service';
import { SerizesController } from './serizes.controller';

@Module({
  controllers: [SerizesController],
  providers: [SerizesService],
})
export class SerizesModule {}
