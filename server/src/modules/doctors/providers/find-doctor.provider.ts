import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinderProvider } from 'src/common/providers/finder.provider';
import { Repository } from 'typeorm';
import {
  ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND,
  ERR_MSG_DOCTOR_WAS_NOT_FOUND,
} from '../doctors.constants';
import { Doctor } from '../entities/doctor.entity';

@Injectable()
export class FindDoctorProvider implements FinderProvider {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorsRepo: Repository<Doctor>,
  ) {}

  async findOr404(userId: number) {
    const doctor = await this.doctorsRepo.findOneBy({ userId });

    if (!doctor) {
      throw new NotFoundException(ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND);
    }

    return doctor;
  }

  async findOrForbid(userId: number) {
    const doctor = await this.doctorsRepo.findOneBy({ userId });

    if (!doctor) {
      throw new ForbiddenException(ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND);
    }

    return doctor;
  }

  async findOrFail(userId: number) {
    const doctor = await this.doctorsRepo.findOneBy({ userId });

    if (!doctor) {
      throw new BadRequestException(ERR_MSG_DOCTOR_WAS_NOT_FOUND);
    }

    return doctor;
  }
}
