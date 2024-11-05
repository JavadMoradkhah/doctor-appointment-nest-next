import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AvailabilityService {
  constructor(private readonly dataSource: DataSource) {}

  async findDates(doctorId: number) {
    return [];
    // const dates = await this.appointmentsRepo.find({
    //   select: {
    //     date: true,
    //     schedule: {
    //       dayName: true,
    //     },
    //   },
    //   relations: {
    //     schedule: true,
    //   },
    //   where: {
    //     doctor: { userId: doctorId },
    //     isAvailable: true,
    //     date: MoreThanOrEqual(new Date(Date.now())),
    //   },
    //   order: {
    //     date: 'ASC',
    //   },
    // });

    // return dates;
  }
}
