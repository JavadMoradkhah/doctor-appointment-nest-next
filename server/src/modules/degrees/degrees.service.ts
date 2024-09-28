import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  ERR_MSG_DEGREE_ALREADY_EXISTS,
  ERR_MSG_DEGREE_WAS_NOT_FOUND,
} from './degrees.constants';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { Degree } from './entities/degree.entity';
import { CreateManyDegreesDto } from './dto/create-many-degrees.dto';
import { PG_ERROR_CODE_UNIQUE_VIOLATION } from 'src/common/constants/database.constants';

@Injectable()
export class DegreesService {
  constructor(
    @InjectRepository(Degree)
    private readonly degreesRepo: Repository<Degree>,
    private readonly dataSource: DataSource,
  ) {}

  async create({ title }: CreateDegreeDto) {
    await this.checkDegreeExists(title);
    return await this.degreesRepo.save(this.degreesRepo.create({ title }));
  }

  async createMany(createManyDegreesDto: CreateManyDegreesDto) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Degree)
        .values(createManyDegreesDto.degrees)
        .execute();
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_DEGREE_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async findAll() {
    const degrees = await this.degreesRepo.find({ order: { title: 'ASC' } });
    return degrees;
  }

  async findOne(id: number) {
    const degree = await this.degreesRepo.findOneBy({ id });

    if (!degree) {
      throw new NotFoundException(ERR_MSG_DEGREE_WAS_NOT_FOUND);
    }

    return degree;
  }

  async update(id: number, updateDegreeDto: UpdateDegreeDto) {
    const degree = await this.findOne(id);

    if (degree.title === updateDegreeDto.title) {
      return degree;
    }

    degree.title = updateDegreeDto.title;

    return await this.degreesRepo.save(degree);
  }

  async remove(id: number) {
    const degree = await this.findOne(id);
    await this.degreesRepo.remove(degree);
  }

  private async checkDegreeExists(title: string) {
    const exists = await this.degreesRepo.existsBy({ title });

    if (exists) {
      throw new ConflictException(ERR_MSG_DEGREE_ALREADY_EXISTS);
    }
  }
}
