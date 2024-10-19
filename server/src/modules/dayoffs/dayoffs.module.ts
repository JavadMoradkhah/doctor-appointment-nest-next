import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from '../pagination/pagination.module';
import { DayOffsController } from './dayoffs.controller';
import { DayOffsService } from './dayoffs.service';
import { DayOff } from './entities/dayoff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DayOff]), PaginationModule],
  controllers: [DayOffsController],
  providers: [DayOffsService],
})
export class DayOffsModule {}
