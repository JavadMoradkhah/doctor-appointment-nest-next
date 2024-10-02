import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND } from '../doctors/doctors.constants';
import { Doctor } from '../doctors/entities/doctor.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import {
  ERR_MSG_SCHEDULE_UNIQUENESS_VIOLATION,
  ERR_MSG_SCHEDULE_WAS_NOT_FOUND,
} from './schedules.constants';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly schedulesRepo: Repository<Schedule>,
    @InjectRepository(Doctor)
    private readonly doctorsRepo: Repository<Doctor>,
  ) {}

  async create(userId: number, createScheduleDto: CreateScheduleDto) {
    const doctor = await this.doctorsRepo.findOneBy({ userId });

    if (!doctor) {
      throw new ForbiddenException(ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND);
    }

    const scheduleExists = await this.schedulesRepo.existsBy({
      doctor: { userId },
      day: createScheduleDto.day,
    });

    if (scheduleExists) {
      throw new ConflictException(ERR_MSG_SCHEDULE_UNIQUENESS_VIOLATION);
    }

    const schedule = await this.schedulesRepo.save(
      this.schedulesRepo.create({
        doctor: { userId },
        day: createScheduleDto.day,
        startAt: createScheduleDto.startAt,
        endAt: createScheduleDto.endAt,
      }),
    );

    return schedule;
  }

  async findAll(userId: number) {
    const schedules = await this.schedulesRepo.find({
      where: { doctor: { userId } },
      order: { day: 'ASC' },
    });

    return schedules;
  }

  async findOne(id: number, userId: number) {
    const schedule = await this.schedulesRepo.findOneBy({ id });

    if (!schedule) {
      throw new BadRequestException(ERR_MSG_SCHEDULE_WAS_NOT_FOUND);
    }

    if (schedule.doctorId !== userId) {
      throw new ForbiddenException();
    }

    return schedule;
  }

  async update(
    id: number,
    userId: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.findOne(id, userId);
    return await this.schedulesRepo.save({ ...schedule, ...updateScheduleDto });
  }

  async remove(id: number, userId: number) {
    const schedule = await this.findOne(id, userId);
    return await this.schedulesRepo.remove(schedule);
  }
}
