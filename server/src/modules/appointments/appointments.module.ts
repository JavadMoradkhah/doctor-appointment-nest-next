import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from '../doctors/doctors.module';
import { PaginationModule } from '../pagination/pagination.module';
import { Schedule } from '../schedules/entities/schedule.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Schedule]),
    DoctorsModule,
    PaginationModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
