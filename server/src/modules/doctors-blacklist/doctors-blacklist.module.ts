import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from '../doctors/doctors.module';
import { PaginationModule } from '../pagination/pagination.module';
import { UsersModule } from '../users/users.module';
import { DoctorsBlacklistController } from './doctors-blacklist.controller';
import { DoctorsBlacklistService } from './doctors-blacklist.service';
import { DoctorsBlacklist } from './entities/doctors-blacklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorsBlacklist]),
    UsersModule,
    DoctorsModule,
    PaginationModule,
  ],
  controllers: [DoctorsBlacklistController],
  providers: [DoctorsBlacklistService],
})
export class DoctorsBlacklistModule {}
