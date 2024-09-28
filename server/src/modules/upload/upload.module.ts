import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';
import s3Config from './config/s3.config';

@Module({
  imports: [ConfigModule.forFeature(s3Config)],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
