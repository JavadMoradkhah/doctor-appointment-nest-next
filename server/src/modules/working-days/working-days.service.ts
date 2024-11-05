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
import { CreateWorkingDayDto } from './dto/create-working-day.dto';
import { UpdateWorkingDayDto } from './dto/update-working-day.dto';
import { WorkingDay } from './entities/working-day.entity';
import { Weekday } from './enums/weekday.enum';
import {
  ERR_MSG_WORKING_DAY_UNIQUENESS_VIOLATION,
  Weekdays,
} from './working-days.constants';

@Injectable()
export class WorkingDaysService {
  constructor(
    @InjectRepository(WorkingDay)
    private readonly workingDaysRepo: Repository<WorkingDay>,
    private readonly findDoctorProvider: FindDoctorProvider,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(
    isAdmin: boolean,
    userId: number,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const [workingDays, count] = await this.workingDaysRepo.findAndCount({
      select: {
        id: true,
        weekday: true,
        dayName: true,
        startsAt: true,
        endsAt: true,
        breakStartsAt: true,
        breakEndsAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        doctor: {
          userId: true,
          avatar: true,
          user: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      relations: {
        doctor: {
          user: true,
        },
      },
      ...(!isAdmin && { where: { doctor: { userId } } }),
      order: { weekday: 'ASC' },
    });

    return this.paginationService.paginate(
      paginationQueryDto,
      workingDays,
      count,
    );
  }

  async findOne(id: number, userId: number) {
    const workingDay = await this.workingDaysRepo.findOneBy({ id });

    if (!workingDay) {
      throw new NotFoundException();
    }

    if (workingDay.doctorId !== userId) {
      throw new ForbiddenException();
    }

    return workingDay;
  }

  async create(userId: number, createWorkingDayDto: CreateWorkingDayDto) {
    const doctor = await this.findDoctorProvider.findOrFail(userId);

    await this.checkWorkingDayExists(userId, createWorkingDayDto.weekday);

    const dayName = Weekdays[createWorkingDayDto.weekday];

    const workingDay = await this.workingDaysRepo.save(
      this.workingDaysRepo.create({
        doctor: { userId: doctor.userId },
        dayName: dayName,
        weekday: createWorkingDayDto.weekday,
        startsAt: createWorkingDayDto.startsAt,
        endsAt: createWorkingDayDto.endsAt,
        ...(createWorkingDayDto.breakStartsAt && {
          breakStartsAt: createWorkingDayDto.breakStartsAt,
        }),
        ...(createWorkingDayDto.breakStartsAt && {
          breakEndsAt: createWorkingDayDto.breakEndsAt,
        }),
      }),
    );

    return workingDay;
  }

  async update(
    id: number,
    userId: number,
    updateWorkingDayDto: UpdateWorkingDayDto,
  ) {
    const workingDay = await this.findOne(id, userId);

    if (updateWorkingDayDto.weekday !== workingDay.weekday) {
      await this.checkWorkingDayExists(userId, updateWorkingDayDto.weekday);
      workingDay.weekday = updateWorkingDayDto.weekday;
      workingDay.dayName = Weekdays[updateWorkingDayDto.weekday];
    }

    workingDay.startsAt = updateWorkingDayDto.startsAt;

    workingDay.endsAt = updateWorkingDayDto.endsAt;

    workingDay.breakStartsAt =
      updateWorkingDayDto.breakStartsAt ?? workingDay.breakStartsAt;

    workingDay.breakEndsAt =
      updateWorkingDayDto.breakEndsAt ?? workingDay.breakEndsAt;

    return await this.workingDaysRepo.save(workingDay);
  }

  async remove(id: number, userId: number) {
    const workingDay = await this.findOne(id, userId);
    await this.workingDaysRepo.remove(workingDay);
  }

  async checkWorkingDayExists(userId: number, weekday: Weekday) {
    const workingDayExists = await this.workingDaysRepo.existsBy({
      doctor: { userId },
      weekday: weekday,
    });

    if (workingDayExists) {
      throw new ConflictException(ERR_MSG_WORKING_DAY_UNIQUENESS_VIOLATION);
    }
  }
}
