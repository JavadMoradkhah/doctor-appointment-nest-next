import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from '../upload/upload.module';
import { ClinicsAdminController } from './controllers/clinics-admin.controller';
import { ClinicsController } from './controllers/clinics.controller';
import { ClinicAddress } from './entities/clinic-address.entity';
import { ClinicPhoto } from './entities/clinic-photo.entity';
import { ClinicTelephone } from './entities/clinic-telephone.entity';
import { Clinic } from './entities/clinic.entity';
import { ClinicsService } from './providers/clinics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Clinic,
      ClinicTelephone,
      ClinicAddress,
      ClinicPhoto,
    ]),
    UploadModule,
  ],
  controllers: [ClinicsController, ClinicsAdminController],
  providers: [ClinicsService],
})
export class ClinicsModule {}
