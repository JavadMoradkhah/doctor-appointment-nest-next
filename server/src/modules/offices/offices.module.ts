import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from '../doctors/doctors.module';
import { PaginationModule } from '../pagination/pagination.module';
import { Office } from './entities/office.entity';
import { OfficesController } from './offices.controller';
import { OfficesService } from './offices.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Office]),
    PaginationModule,
    DoctorsModule,
  ],
  controllers: [OfficesController],
  providers: [OfficesService],
})
export class OfficesModule {}
