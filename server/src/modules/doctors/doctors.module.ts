import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreesModule } from '../degrees/degrees.module';
import { PaginationModule } from '../pagination/pagination.module';
import { SpecializationsModule } from '../specializations/specializations.module';
import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor]),
    UsersModule,
    UploadModule,
    PaginationModule,
    SpecializationsModule,
    DegreesModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
