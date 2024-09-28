import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { Specialization } from './entities/specialization.entity';
import {
  ERR_MSG_SPECIALIZATION_ALREADY_EXISTS,
  ERR_MSG_SPECIALIZATION_WAS_NOT_FOUND,
} from './specializations.consttants';
import { CreateManySpecializationsDto } from './dto/create-many-specializations.dto';
import { PG_ERROR_CODE_UNIQUE_VIOLATION } from 'src/common/constants/database.constants';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(Specialization)
    private readonly specializationsRepo: Repository<Specialization>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    const specializations = await this.specializationsRepo.find({
      order: {
        title: 'ASC',
      },
    });
    return specializations;
  }

  async findOne(id: number) {
    const specialization = await this.specializationsRepo.findOneBy({ id });

    if (!specialization) {
      throw new NotFoundException(ERR_MSG_SPECIALIZATION_WAS_NOT_FOUND);
    }

    return specialization;
  }

  async create(createSpecializationDto: CreateSpecializationDto) {
    await this.checkSpecializationExists(
      createSpecializationDto.title,
      createSpecializationDto.slug,
    );

    const specialization = await this.specializationsRepo.save(
      this.specializationsRepo.create(createSpecializationDto),
    );

    return specialization;
  }

  async createMany(createManySpecializationsDto: CreateManySpecializationsDto) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Specialization)
        .values(createManySpecializationsDto.specializations)
        .execute();
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_SPECIALIZATION_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async update(id: number, updateSpecializationDto: UpdateSpecializationDto) {
    const specialization = await this.findOne(id);

    // If neither the title nor slug has been changed, skip the update operation
    if (
      updateSpecializationDto.title === specialization.title &&
      updateSpecializationDto.slug === specialization.slug
    ) {
      return specialization;
    }

    await this.checkSpecializationExists(
      updateSpecializationDto.title,
      updateSpecializationDto.slug,
    );

    specialization.title = updateSpecializationDto.title;
    specialization.slug = updateSpecializationDto.slug;

    return await this.specializationsRepo.save(specialization);
  }

  async remove(id: number) {
    const specialization = await this.findOne(id);
    await this.specializationsRepo.remove(specialization);
  }

  private async checkSpecializationExists(title: string, slug: string) {
    const specializationExists = await this.specializationsRepo.exists({
      where: [{ title }, { slug }],
    });

    if (specializationExists) {
      throw new ConflictException(ERR_MSG_SPECIALIZATION_ALREADY_EXISTS);
    }
  }
}
