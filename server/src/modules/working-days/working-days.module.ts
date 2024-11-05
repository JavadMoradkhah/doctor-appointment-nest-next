import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from '../doctors/doctors.module';
import { PaginationModule } from '../pagination/pagination.module';
import { WorkingDay } from './entities/working-day.entity';
import { WorkingDaysController } from './working-days.controller';
import { WorkingDaysService } from './working-days.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkingDay]),
    DoctorsModule,
    PaginationModule,
  ],
  controllers: [WorkingDaysController],
  providers: [WorkingDaysService],
})
export class WorkingDaysModule {}
