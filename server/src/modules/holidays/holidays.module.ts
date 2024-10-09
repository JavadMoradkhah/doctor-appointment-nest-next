import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from '../pagination/pagination.module';
import { Holiday } from './entities/holiday.entity';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday]), PaginationModule],
  controllers: [HolidaysController],
  providers: [HolidaysService],
})
export class HolidaysModule {}
