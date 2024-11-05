import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreesModule } from '../degrees/degrees.module';
import { PaginationModule } from '../pagination/pagination.module';
import { SpecializationsModule } from '../specializations/specializations.module';
import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';
import { AvailabilityController } from './availability/availability.controller';
import { AvailabilityService } from './availability/availability.service';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';
import { FindDoctorProvider } from './providers/find-doctor.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor]),
    UsersModule,
    UploadModule,
    PaginationModule,
    SpecializationsModule,
    DegreesModule,
  ],
  controllers: [DoctorsController, AvailabilityController],
  providers: [DoctorsService, FindDoctorProvider, AvailabilityService],
  exports: [FindDoctorProvider],
})
export class DoctorsModule {}
