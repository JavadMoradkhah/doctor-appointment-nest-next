import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/providers/pagination.service';
import { ERR_MSG_DAY_OFF_UNIQUENESS_VIOLATION } from './dayoff.constants';
import { CreateDayOffDto } from './dto/create-dayoff.dto';
import { UpdateDayOffDto } from './dto/update-dayoff.dto';
import { DayOff } from './entities/dayoff.entity';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class DayOffsService {
  constructor(
    @InjectRepository(DayOff)
    private readonly dayOffsRepo: Repository<DayOff>,
    private readonly paginationService: PaginationService,
    private dataSource: DataSource,
  ) {}

  async findAll(
    userId: number,
    userRole: UserRole,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const isAdmin = userRole === UserRole.ADMIN;

    const [dayOffs, count] = await this.dayOffsRepo.findAndCount({
      select: {
        id: true,
        startDate: true,
        endDate: true,
        description: true,
        ...(isAdmin && {
          doctor: {
            user: {
              firstName: true,
              lastName: true,
              phone: true,
            },
            avatar: true,
          },
          createdAt: true,
          updatedAt: true,
        }),
      },
      ...(isAdmin && {
        relations: {
          doctor: {
            user: true,
          },
        },
      }),
      ...(userRole === UserRole.DOCTOR && {
        where: {
          doctor: { userId },
        },
      }),
      order: {
        createdAt: 'DESC',
      },
    });

    return this.paginationService.paginate(paginationQueryDto, dayOffs, count);
  }

  async findOne(userId: number, userRole: UserRole, id: number) {
    const dayOff = await this.dayOffsRepo.findOne({
      select: {
        id: true,
        startDate: true,
        endDate: true,
        description: true,
        doctor: {
          userId: true,
          user: {
            firstName: true,
            lastName: true,
            phone: true,
          },
          avatar: true,
          medicalSystemNumber: true,
        },
        createdAt: true,
        updatedAt: true,
      },
      relations: {
        doctor: {
          user: true,
        },
      },
      where: { id },
    });

    if (!dayOff) {
      throw new NotFoundException();
    }

    console.log({ userId: userId, doctorId: dayOff.doctorId });

    if (userRole !== UserRole.ADMIN && dayOff.doctor.userId !== userId) {
      throw new ForbiddenException();
    }

    return dayOff;
  }

  async create(doctorId: number, createDayOffDto: CreateDayOffDto) {
    await this.checkDayOffExists(
      doctorId,
      createDayOffDto.startDate,
      createDayOffDto.endDate,
    );

    const dayOff = await this.dayOffsRepo.save(
      this.dayOffsRepo.create({
        ...createDayOffDto,
        doctor: { userId: doctorId },
      }),
    );

    return dayOff;
  }

  async update(id: number, doctorId: number, updateDayOffDto: UpdateDayOffDto) {
    const dayOff = await this.findOrFail(id, doctorId);

    if (
      updateDayOffDto.startDate !== dayOff.startDate ||
      updateDayOffDto.endDate !== dayOff.endDate
    ) {
      await this.checkDayOffExists(
        doctorId,
        updateDayOffDto.startDate,
        updateDayOffDto.endDate,
      );

      dayOff.startDate = updateDayOffDto.startDate;
      dayOff.endDate = updateDayOffDto.endDate;
    }

    dayOff.description = updateDayOffDto.description ?? dayOff.description;

    return await this.dayOffsRepo.save(dayOff);
  }

  async remove(id: number, doctorId: number) {
    const dayOff = await this.findOrFail(id, doctorId);
    await this.dayOffsRepo.remove(dayOff);
  }

  async findOrFail(id: number, doctorId: number) {
    const dayOff = await this.dayOffsRepo.findOneBy({ id });

    if (!dayOff) {
      throw new NotFoundException();
    }

    if (dayOff.doctorId !== doctorId) {
      throw new ForbiddenException();
    }

    return dayOff;
  }

  async checkDayOffExists(doctorId: number, startDate: Date, endDate: Date) {
    const exists = await this.dayOffsRepo
      .createQueryBuilder('dayOff')
      .where('dayOff.doctorUserId = :doctorId', { doctorId })
      .andWhere(
        '(:startDate BETWEEN dayOff.startDate AND dayOff.endDate OR :endDate BETWEEN dayOff.startDate AND dayOff.endDate)',
        { startDate, endDate },
      )
      .getOne();

    if (exists) {
      throw new ConflictException(ERR_MSG_DAY_OFF_UNIQUENESS_VIOLATION);
    }
  }
}
