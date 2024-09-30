import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { title } from 'process';
import { Repository } from 'typeorm';
import { ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND } from '../doctors/doctors.constants';
import { Doctor } from '../doctors/entities/doctor.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import {
  ERR_MSG_SERVICE_UNIQUENESS_VIOLATION,
  ERR_MSG_SERVICE_WAS_NOT_FOUND,
} from './services.constants';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepo: Repository<Service>,
    @InjectRepository(Doctor)
    private readonly doctorsRepo: Repository<Doctor>,
  ) {}

  async findOne(id: number, userId: number) {
    const service = await this.servicesRepo.findOneBy({
      id: id,
      doctor: { userId },
    });

    if (!service) {
      throw new NotFoundException(ERR_MSG_SERVICE_WAS_NOT_FOUND);
    }

    return service;
  }

  async create(userId: number, createServiceDto: CreateServiceDto) {
    const doctor = await this.doctorsRepo.findOneBy({ userId });

    if (!doctor) {
      throw new ForbiddenException(ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND);
    }

    await this.checkServiceExists(userId, createServiceDto.title);

    const service = await this.servicesRepo.save(
      this.servicesRepo.create({
        title: createServiceDto.title,
        doctor: { userId: userId },
      }),
    );

    return service;
  }

  async update(id: number, userId: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id, userId);

    if (updateServiceDto.title === service.title) {
      return service;
    }

    await this.checkServiceExists(userId, title);

    service.title = updateServiceDto.title;

    return await this.servicesRepo.save(service);
  }

  async remove(id: number, userId: number) {
    const service = await this.findOne(id, userId);
    await this.servicesRepo.remove(service);
  }

  async checkServiceExists(userId: number, title: string) {
    const serviceExists = await this.servicesRepo.existsBy({
      doctor: { userId },
      title: title,
    });

    if (serviceExists) {
      throw new ConflictException(ERR_MSG_SERVICE_UNIQUENESS_VIOLATION);
    }
  }
}
