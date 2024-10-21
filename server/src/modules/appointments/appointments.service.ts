import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { FindDoctorProvider } from '../doctors/providers/find-doctor.provider';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/providers/pagination.service';
import { Schedule } from '../schedules/entities/schedule.entity';
import { ERR_MSG_SCHEDULE_WAS_NOT_FOUND_BY_DATE } from '../schedules/schedules.constants';
import { UserRole } from '../users/enums/user-role.enum';
import { ERR_MSG_APPOINTMENT_UNIQUENESS_VIOLATION } from './appointments.constants';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { CreateManyAppointmentsDto } from './dto/create-many-appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepo: Repository<Appointment>,
    @InjectRepository(Schedule)
    private readonly schedulesRepo: Repository<Schedule>,
    private readonly dataSource: DataSource,
    private readonly findDoctorProvider: FindDoctorProvider,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(
    userId: number,
    userRole: UserRole,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const isAdmin = userRole === UserRole.ADMIN;

    const [appointments, count] = await this.appointmentsRepo.findAndCount({
      select: {
        id: true,
        date: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
        schedule: {
          id: true,
          dayName: true,
        },
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
      ...(!isAdmin && {
        where: {
          doctor: { userId },
        },
      }),
      order: {
        createdAt: 'DESC',
      },
    });

    return this.paginationService.paginate(
      paginationQueryDto,
      appointments,
      count,
    );
  }

  async findOne(id: number, userId: number, userRole: UserRole) {
    const appointment = await this.appointmentsRepo.findOne({
      select: {
        id: true,
        date: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
        schedule: {
          id: true,
          dayName: true,
        },
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
      where: {
        id,
      },
    });

    if (!appointment) {
      throw new NotFoundException();
    }

    if (userRole !== UserRole.ADMIN && appointment.doctor.userId !== userId) {
      throw new ForbiddenException();
    }

    return appointment;
  }

  async create(userId: number, createAppointmentDto: CreateAppointmentDto) {
    await this.findDoctorProvider.findOrForbid(userId);

    await this.checkAppointmentExists(userId, createAppointmentDto.date);

    const schedule = await this.findScheduleByDate(
      userId,
      createAppointmentDto.date,
    );

    const appointment = await this.appointmentsRepo.save(
      this.appointmentsRepo.create({
        doctor: { userId },
        schedule: { id: schedule.id },
        date: createAppointmentDto.date,
      }),
    );

    return appointment;
  }

  async bulkCreate(
    userId: number,
    createManyAppointmentsDto: CreateManyAppointmentsDto,
  ) {
    await this.checkAppointmentExistsInRange(
      userId,
      createManyAppointmentsDto.startDate,
      createManyAppointmentsDto.endDate,
    );

    const result = await this.dataSource.manager.query(
      `
      WITH inserted_rows AS (
        INSERT INTO appointments("doctorId", "scheduleId", "date")
        SELECT
          $1::smallint,
          schedules.id AS scheduleId,
          datetime::date AS date
        FROM generate_series(
          $2::timestamp,
          $3::timestamp,
          '1 day'::interval,
          'Asia/Tehran'
        ) AS datetime
        JOIN schedules
          ON EXTRACT(DOW FROM datetime) = schedules.weekday
        ORDER BY date
        RETURNING id
      )
      SELECT count(*) AS count FROM insertedRows;  
      `,
      [
        userId,
        createManyAppointmentsDto.startDate,
        createManyAppointmentsDto.endDate,
      ],
    );

    return result;
  }

  async update(
    id: number,
    userId: number,
    userRole: UserRole,
    updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.findOr404(id, userId, userRole);

    if (
      updateAppointmentDto.date &&
      updateAppointmentDto.date !== appointment.date
    ) {
      await this.checkAppointmentExists(userId, updateAppointmentDto.date);

      const schedule = await this.findScheduleByDate(
        userId,
        updateAppointmentDto.date,
      );

      appointment.date = updateAppointmentDto.date;
      appointment.schedule.id = schedule.id;
    }

    appointment.isAvailable =
      updateAppointmentDto.isAvailable ?? appointment.isAvailable;

    return await this.appointmentsRepo.save(appointment);
  }

  async remove(id: number, userId: number, userRole: UserRole) {
    const appointment = await this.findOr404(id, userId, userRole);
    await this.appointmentsRepo.remove(appointment);
  }

  async checkAppointmentExists(doctorId: number, date: Date) {
    const exists = await this.appointmentsRepo.existsBy({
      doctor: { userId: doctorId },
      date: date,
    });

    if (exists) {
      throw new ConflictException(ERR_MSG_APPOINTMENT_UNIQUENESS_VIOLATION);
    }
  }

  async checkAppointmentExistsInRange(
    doctorId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const exists = await this.appointmentsRepo.existsBy({
      doctor: { userId: doctorId },
      date: Between(startDate, endDate),
    });

    if (exists) {
      throw new ConflictException(ERR_MSG_APPOINTMENT_UNIQUENESS_VIOLATION);
    }
  }

  async findOr404(id: number, userId: number, userRole: UserRole) {
    const appointment = await this.appointmentsRepo.findOne({
      relations: {
        doctor: true,
      },
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException();
    }

    if (userRole !== UserRole.ADMIN && appointment.doctor.userId !== userId) {
      throw new ForbiddenException();
    }

    return appointment;
  }

  async findScheduleByDate(doctorId: number, date: Date) {
    const schedule = await this.schedulesRepo.findOneBy({
      doctor: { userId: doctorId },
      weekday: date.getDay(),
    });

    if (!schedule) {
      throw new BadRequestException(ERR_MSG_SCHEDULE_WAS_NOT_FOUND_BY_DATE);
    }

    return schedule;
  }
}
