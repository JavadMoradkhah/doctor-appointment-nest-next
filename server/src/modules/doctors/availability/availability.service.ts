import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepo: Repository<Appointment>,
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
}
