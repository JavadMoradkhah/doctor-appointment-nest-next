import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindDoctorProvider } from '../doctors/providers/find-doctor.provider';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/providers/pagination.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ERR_MSG_SCHEDULE_UNIQUENESS_VIOLATION } from './schedules.constants';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly schedulesRepo: Repository<Schedule>,
    private readonly findDoctorProvider: FindDoctorProvider,
    private readonly paginationService: PaginationService,
  ) {}

  async findDoctorAllSchedules(
    userId: number,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const [schedules, count] = await this.schedulesRepo.findAndCount({
      select: {
        id: true,
        startDate: true,
        endDate: true,
        appointmentsDuration: true,
        isAvailable: true,
      },
      where: {
        doctor: {
          userId: userId,
        },
      },
      order: {
        startDate: 'DESC',
      },
      skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
      take: paginationQueryDto.limit,
    });

    return this.paginationService.paginate(
      paginationQueryDto,
      schedules,
      count,
    );
  }

  async findDoctorSchedule(id: number, doctorId: number) {
    const schedule = await this.schedulesRepo.findOne({
      select: {
        id: true,
        startDate: true,
        endDate: true,
        appointmentsDuration: true,
        isAvailable: true,
        doctor: {
          userId: true,
        },
      },
      relations: {
        doctor: {
          user: true,
        },
      },
      where: {
        id: id,
      },
    });

    if (!schedule) {
      throw new NotFoundException();
    }

    if (schedule.doctor.userId !== doctorId) {
      throw new ForbiddenException();
    }

    return schedule;
  }

  async create(doctorId: number, createScheduleDto: CreateScheduleDto) {
    const doctor = await this.findDoctorProvider.findOrForbid(doctorId);

    await this.checkScheduleExists(
      doctorId,
      createScheduleDto.startDate,
      createScheduleDto.endDate,
    );

    const schedule = await this.schedulesRepo.save(
      this.schedulesRepo.create({
        doctor: { userId: doctor.userId },
        startDate: createScheduleDto.startDate,
        endDate: createScheduleDto.endDate,
        isAvailable: createScheduleDto.isAvailable,
        appointmentsDuration: createScheduleDto.appointmentsDuration,
      }),
    );

    return schedule;
  }

  async update(
    id: number,
    doctorId: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.findOr404(id, doctorId);

    const hasStartDateOrEndDateChanged =
      updateScheduleDto.startDate !== schedule.startDate ||
      updateScheduleDto.endDate !== schedule.endDate;

    if (hasStartDateOrEndDateChanged) {
      await this.checkScheduleExists(
        doctorId,
        updateScheduleDto.startDate,
        updateScheduleDto.endDate,
      );

      schedule.startDate = updateScheduleDto.startDate;
      schedule.endDate = updateScheduleDto.endDate;
    }

    schedule.appointmentsDuration = updateScheduleDto.appointmentsDuration;

    schedule.isAvailable = updateScheduleDto.isAvailable;

    return await this.schedulesRepo.save(schedule);
  }

  async remove(id: number, doctorId: number) {
    const schedule = await this.findOr404(id, doctorId);
    await this.schedulesRepo.remove(schedule);
  }

  async findOr404(id: number, doctorId: number) {
    const schedule = await this.schedulesRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        doctor: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException();
    }

    if (schedule.doctor.userId !== doctorId) {
      throw new ForbiddenException();
    }

    return schedule;
  }

  async checkScheduleExists(
    doctorId: number,
    startDate: string,
    endDate: string,
  ) {
    const exists = await this.schedulesRepo
      .createQueryBuilder('schedule')
      .where('schedule.doctorId = :doctorId', { doctorId })
      .andWhere(
        '(:startDate BETWEEN schedule.startDate AND schedule.endDate OR :endDate BETWEEN schedule.startDate AND schedule.endDate)',
        { startDate, endDate },
      )
      .getOne();

    if (exists) {
      throw new ConflictException(ERR_MSG_SCHEDULE_UNIQUENESS_VIOLATION);
    }
  }
}
