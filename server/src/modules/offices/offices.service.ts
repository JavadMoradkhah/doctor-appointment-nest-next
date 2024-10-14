import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_ERROR_CODE_UNIQUE_VIOLATION } from 'src/common/constants/database.constants';
import { Repository } from 'typeorm';
import { FindDoctorProvider } from '../doctors/providers/find-doctor.provider';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/providers/pagination.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Office } from './entities/office.entity';
import { ERR_MSG_OFFICE_UNIQUENESS_VIOLATION } from './offices.constants';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private readonly officesRepo: Repository<Office>,
    private readonly paginationService: PaginationService,
    private readonly findDoctorProvider: FindDoctorProvider,
  ) {}

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const [offices, count] = await this.officesRepo.findAndCount({
      select: {
        id: true,
        doctor: {
          userId: true,
          user: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        officeNumber: true,
        floor: true,
        createdAt: true,
      },
      relations: {
        doctor: {
          user: true,
        },
      },
      order: {
        officeNumber: 'ASC',
      },
    });

    return this.paginationService.paginate(paginationQueryDto, offices, count);
  }

  async findOne(id: number) {
    const office = await this.officesRepo.findOne({
      select: {
        id: true,
        doctor: {
          userId: true,
          avatar: true,
          user: {
            firstName: true,
            lastName: true,
            phone: true,
            gender: true,
            isActive: true,
          },
        },
        officeNumber: true,
        floor: true,
        createdAt: true,
      },
      where: { id },
      relations: {
        doctor: {
          user: true,
        },
      },
      order: {
        officeNumber: 'ASC',
      },
    });

    if (!office) {
      throw new NotFoundException();
    }

    return office;
  }

  async create(createOfficeDto: CreateOfficeDto) {
    const doctor = await this.findDoctorProvider.findOrFail(
      createOfficeDto.doctorId,
    );

    try {
      const office = await this.officesRepo.save(
        this.officesRepo.create({
          doctor: { userId: doctor.userId },
          floor: createOfficeDto.floor,
          officeNumber: createOfficeDto.officeNumber,
        }),
      );

      return office;
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_OFFICE_UNIQUENESS_VIOLATION);
      }
      throw error;
    }
  }

  async update(id: number, updateOfficeDto: UpdateOfficeDto) {
    const office = await this.findOrFail(id);

    const officeNumberIsChanged =
      updateOfficeDto.officeNumber &&
      updateOfficeDto.officeNumber !== office.officeNumber;

    if (officeNumberIsChanged) {
      await this.checkOfficeExists(updateOfficeDto.officeNumber);
    }

    office.officeNumber = officeNumberIsChanged
      ? updateOfficeDto.officeNumber
      : office.officeNumber;

    office.floor = updateOfficeDto.floor ?? office.floor;

    return await this.officesRepo.save(office);
  }

  async checkOfficeExists(officeNumber: number) {
    const exists = await this.officesRepo.existsBy({
      officeNumber,
    });

    if (exists) {
      throw new ConflictException(ERR_MSG_OFFICE_UNIQUENESS_VIOLATION);
    }
  }

  async findOrFail(id: number) {
    const office = await this.officesRepo.findOneBy({ id });

    if (!office) {
      throw new NotFoundException();
    }

    return office;
  }
}
