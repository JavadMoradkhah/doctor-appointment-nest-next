import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreesController } from './degrees.controller';
import { DegreesService } from './degrees.service';
import { Degree } from './entities/degree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Degree])],
  controllers: [DegreesController],
  providers: [DegreesService],
})
export class DegreesModule {}
