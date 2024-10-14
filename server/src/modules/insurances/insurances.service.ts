import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_ERROR_CODE_UNIQUE_VIOLATION } from 'src/common/constants/database.constants';
import { Repository } from 'typeorm';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { Insurance } from './entities/insurance.entity';
import { ERR_MSG_INSURANCE_UNIQUENESS_VIOLATION } from './insurances.constants';

@Injectable()
export class InsurancesService {
  constructor(
    @InjectRepository(Insurance)
    private readonly insurancesRepo: Repository<Insurance>,
  ) {}

  async findAll() {
    const insurances = await this.insurancesRepo.find({
      order: { name: 'ASC' },
    });

    return insurances;
  }

  async findOne(id: number) {
    const insurance = await this.insurancesRepo.findOneBy({ id });

    if (!insurance) {
      throw new NotFoundException();
    }

    return insurance;
  }

  async create(createInsuranceDto: CreateInsuranceDto) {
    try {
      const insurance = await this.insurancesRepo.save(
        this.insurancesRepo.create({ name: createInsuranceDto.name }),
      );

      return insurance;
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_INSURANCE_UNIQUENESS_VIOLATION);
      }
      throw error;
    }
  }

  async update(id: number, updateInsuranceDto: UpdateInsuranceDto) {
    const insurance = await this.findOne(id);

    if (updateInsuranceDto.name === insurance.name) {
      return insurance;
    }

    const insuranceExists = await this.insurancesRepo.existsBy({
      name: updateInsuranceDto.name,
    });

    if (insuranceExists) {
      throw new ConflictException(ERR_MSG_INSURANCE_UNIQUENESS_VIOLATION);
    }

    insurance.name = updateInsuranceDto.name;

    return await this.insurancesRepo.save(insurance);
  }

  async remove(id: number) {
    const insurance = await this.findOne(id);
    await this.insurancesRepo.remove(insurance);
  }
}
