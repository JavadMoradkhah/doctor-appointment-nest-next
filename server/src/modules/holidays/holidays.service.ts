import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/providers/pagination.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { Holiday } from './entities/holiday.entity';
import { ERR_MSG_HOLIDAY_UNIQUENESS_VIOLATION } from './holidays.constants';
import { CreateManyHolidaysDto } from './dto/create-many-holidays.dto';
import { PG_ERROR_CODE_UNIQUE_VIOLATION } from 'src/common/constants/database.constants';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidaysRepo: Repository<Holiday>,
    private readonly paginationService: PaginationService,
    private readonly dataSource: DataSource,
  ) {}

  async create({ date, description }: CreateHolidayDto) {
    await this.checkHolidayExists(date);

    const holiday = await this.holidaysRepo.save(
      this.holidaysRepo.create({ date, description }),
    );

    return holiday;
  }

  async createMany(createManyHolidaysDto: CreateManyHolidaysDto) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Holiday)
        .values(createManyHolidaysDto.holidays)
        .execute();
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_HOLIDAY_UNIQUENESS_VIOLATION);
      }
      throw error;
    }
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const [holidays, count] = await this.holidaysRepo.findAndCount({
      take: paginationQuery.limit,
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return this.paginationService.paginate(paginationQuery, holidays, count);
  }

  async findOne(id: number) {
    const holiday = await this.holidaysRepo.findOneBy({ id });

    if (!holiday) {
      throw new NotFoundException();
    }

    return holiday;
  }

  async update(id: number, updateHolidayDto: UpdateHolidayDto) {
    const holiday = await this.findOne(id);

    if (
      updateHolidayDto.date &&
      updateHolidayDto.date.getTime() !== holiday.date.getTime()
    ) {
      await this.checkHolidayExists(updateHolidayDto.date);

      holiday.date = updateHolidayDto.date;
    }

    if (
      updateHolidayDto.description &&
      updateHolidayDto.description !== holiday.description
    ) {
      holiday.description = updateHolidayDto.description;
    }

    return await this.holidaysRepo.save(holiday);
  }

  async remove(id: number) {
    const holiday = await this.findOne(id);
    await this.holidaysRepo.remove(holiday);
  }

  async checkHolidayExists(date: Date) {
    const holidayExists = await this.holidaysRepo.existsBy({ date });

    if (holidayExists) {
      throw new ConflictException(ERR_MSG_HOLIDAY_UNIQUENESS_VIOLATION);
    }
  }
}
