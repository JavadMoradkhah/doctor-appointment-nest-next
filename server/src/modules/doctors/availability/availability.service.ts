import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepo: Repository<Appointment>,
    private readonly dataSource: DataSource,
  ) {}

  async findDates(doctorId: number) {
    const dates = await this.appointmentsRepo.find({
      select: {
        date: true,
        schedule: {
          dayName: true,
        },
      },
      relations: {
        schedule: true,
      },
      where: {
        doctor: { userId: doctorId },
        isAvailable: true,
        date: MoreThanOrEqual(new Date(Date.now())),
      },
      order: {
        date: 'ASC',
      },
    });

    return dates;
  }

  async findTimes(doctorId: number, date: Date) {
    const timeSlots = await this.dataSource.manager.query(
      `
        SELECT
            gs."startTime"::time,
            (gs."startTime" + make_interval(mins => "schedules"."appointmentsDuration"::smallint))::time AS "endTime",
            "appointments"."isAvailable"
        FROM "appointments"
        LEFT JOIN "schedules"
            ON "schedules"."id" = "appointments"."scheduleId"
        JOIN generate_series(
            "appointments"."date"::timestamp + "schedules"."startsAt"::time,
            "appointments"."date"::timestamp + "schedules"."endsAt"::time - make_interval(mins => "schedules"."appointmentsDuration"::smallint),
            make_interval(mins => "schedules"."appointmentsDuration"::smallint)
        ) AS gs("startTime")
        ON TRUE
        WHERE
            "appointments"."doctorId" = $1
            AND "appointments"."date" = $2
            AND (
            gs."startTime"::time < COALESCE("schedules"."breakStartsAt", '24:00'::time) 
            OR 
            gs."startTime"::time >= COALESCE("schedules"."breakEndsAt", '00:00'::time)
        );
    `,
      [doctorId, date],
    );

    return timeSlots;
  }
}
