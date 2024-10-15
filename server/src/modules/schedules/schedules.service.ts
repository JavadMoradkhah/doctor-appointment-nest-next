import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindDoctorProvider } from '../doctors/providers/find-doctor.provider';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { Weekday } from './enums/weekday.enum';
import {
  ERR_MSG_SCHEDULE_UNIQUENESS_VIOLATION,
  Weekdays,
} from './schedules.constants';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly schedulesRepo: Repository<Schedule>,
    private readonly findDoctorProvider: FindDoctorProvider,
  ) {}

  async findAll(userId: number) {
    const schedules = await this.schedulesRepo.find({
      where: { doctor: { userId } },
      order: { weekday: 'ASC' },
    });

    return schedules;
  }

  async findOne(id: number, userId: number) {
    const schedule = await this.schedulesRepo.findOneBy({ id });

    if (!schedule) {
      throw new NotFoundException();
    }

    if (schedule.doctorId !== userId) {
      throw new ForbiddenException();
    }

    return schedule;
  }

  async create(userId: number, createScheduleDto: CreateScheduleDto) {
    const doctor = await this.findDoctorProvider.findOrFail(userId);

    await this.checkScheduleExists(userId, createScheduleDto.weekday);

    const dayName = Weekdays[createScheduleDto.weekday];

    const schedule = await this.schedulesRepo.save(
      this.schedulesRepo.create({
        doctor: { userId: doctor.userId },
        dayName: dayName,
        weekday: createScheduleDto.weekday,
        startsAt: createScheduleDto.startsAt,
        endsAt: createScheduleDto.endsAt,
        appointmentsDuration: createScheduleDto.appointmentsDuration,
        ...(createScheduleDto.breakStartsAt && {
          breakStartsAt: createScheduleDto.breakStartsAt,
        }),
        ...(createScheduleDto.breakStartsAt && {
          breakEndsAt: createScheduleDto.breakEndsAt,
        }),
      }),
    );

    return schedule;
  }

  async update(
    id: number,
    userId: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.findOne(id, userId);

    if (updateScheduleDto.weekday !== schedule.weekday) {
      await this.checkScheduleExists(userId, updateScheduleDto.weekday);
      schedule.weekday = updateScheduleDto.weekday;
      schedule.dayName = Weekdays[updateScheduleDto.weekday];
    }

    schedule.appointmentsDuration = updateScheduleDto.appointmentsDuration;
    schedule.startsAt = updateScheduleDto.startsAt;
    schedule.endsAt = updateScheduleDto.endsAt;
    schedule.breakStartsAt =
      updateScheduleDto.breakStartsAt ?? schedule.breakStartsAt;
    schedule.breakEndsAt =
      updateScheduleDto.breakEndsAt ?? schedule.breakEndsAt;

    return await this.schedulesRepo.save(schedule);
  }

  async remove(id: number, userId: number) {
    const schedule = await this.findOne(id, userId);
    return await this.schedulesRepo.remove(schedule);
  }

  async checkScheduleExists(userId: number, weekday: Weekday) {
    const scheduleExists = await this.schedulesRepo.existsBy({
      doctor: { userId },
      weekday: weekday,
    });

    if (scheduleExists) {
      throw new ConflictException(ERR_MSG_SCHEDULE_UNIQUENESS_VIOLATION);
    }
  }
}
