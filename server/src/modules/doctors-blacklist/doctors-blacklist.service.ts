import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindDoctorProvider } from '../doctors/providers/find-doctor.provider';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/providers/pagination.service';
import { UserRole } from '../users/enums/user-role.enum';
import { FindPatientProvider } from '../users/providers/find-patient-provider';
import { ERR_MSG_DOCTORS_BLACKLIST_PATIENT_UNIQUENESS_VIOLATION } from './doctors-blacklist.constants';
import { CreateDoctorsBlacklistDto } from './dto/create-doctors-blacklist.dto';
import { UpdateDoctorsBlacklistDto } from './dto/update-doctors-blacklist.dto';
import { DoctorsBlacklist } from './entities/doctors-blacklist.entity';

@Injectable()
export class DoctorsBlacklistService {
  constructor(
    @InjectRepository(DoctorsBlacklist)
    private readonly doctorsBlacklistRepo: Repository<DoctorsBlacklist>,
    private readonly paginationService: PaginationService,
    private readonly findDoctorProvider: FindDoctorProvider,
    private readonly findPatientProvider: FindPatientProvider,
  ) {}

  async findOr404(id: number, userId: number, userRole: UserRole) {
    const entity = await this.doctorsBlacklistRepo.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException();
    }

    if (userRole !== UserRole.ADMIN && entity.doctorId !== userId) {
      throw new ForbiddenException();
    }

    return entity;
  }

  async checkPatientAddedToBlacklist(doctorId: number, patientId: number) {
    const exists = await this.doctorsBlacklistRepo.existsBy({
      doctor: { userId: doctorId },
      patient: { id: patientId },
    });

    if (exists) {
      throw new ConflictException(
        ERR_MSG_DOCTORS_BLACKLIST_PATIENT_UNIQUENESS_VIOLATION,
      );
    }
  }

  async findAll(
    userId: number,
    userRole: UserRole,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const isAdmin = userRole === UserRole.ADMIN;

    const [entities, count] = await this.doctorsBlacklistRepo.findAndCount({
      select: {
        id: true,
        doctor: {
          avatar: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
            ...(isAdmin && { phone: true }),
          },
        },
        patient: {
          id: true,
          firstName: true,
          lastName: true,
          ...(isAdmin && { phone: true }),
        },
        expiresAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: {
        doctor: {
          user: true,
        },
        patient: true,
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

    return this.paginationService.paginate(paginationQueryDto, entities, count);
  }

  async findOne(id: number, userId: number, userRole: UserRole) {
    const isAdmin = userRole === UserRole.ADMIN;

    const entity = await this.doctorsBlacklistRepo.findOne({
      select: {
        id: true,
        doctor: {
          avatar: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
            ...(isAdmin && { phone: true }),
          },
        },
        patient: {
          id: true,
          firstName: true,
          lastName: true,
          ...(isAdmin && { phone: true }),
        },
        expiresAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: {
        doctor: {
          user: true,
        },
        patient: true,
      },
      where: {
        id: id,
      },
    });

    if (!entity) {
      throw new NotFoundException();
    }

    if (userRole !== UserRole.ADMIN && entity.doctor.user.id !== userId) {
      throw new ForbiddenException();
    }

    return entity;
  }

  async create(
    doctorId: number,
    createDoctorsBlacklistDto: CreateDoctorsBlacklistDto,
  ) {
    await this.findDoctorProvider.findOrForbid(doctorId);

    await this.findPatientProvider.findOrFail(
      createDoctorsBlacklistDto.patientId,
    );

    await this.checkPatientAddedToBlacklist(
      doctorId,
      createDoctorsBlacklistDto.patientId,
    );

    const entity = await this.doctorsBlacklistRepo.save(
      this.doctorsBlacklistRepo.create({
        doctor: { userId: doctorId },
        patient: { id: createDoctorsBlacklistDto.patientId },
        notes: createDoctorsBlacklistDto.notes,
        ...(createDoctorsBlacklistDto.expiresAt && {
          expiresAt: createDoctorsBlacklistDto.expiresAt,
        }),
      }),
    );

    return entity;
  }

  async update(
    id: number,
    userId: number,
    userRole: UserRole,
    updateDoctorsBlacklistDto: UpdateDoctorsBlacklistDto,
  ) {
    const entity = await this.findOr404(id, userId, userRole);
    entity.notes = updateDoctorsBlacklistDto.notes ?? entity.notes;
    entity.expiresAt = updateDoctorsBlacklistDto.expiresAt ?? entity.expiresAt;
    return await this.doctorsBlacklistRepo.save(entity);
  }

  async remove(id: number, userId: number, userRole: UserRole) {
    const entity = await this.findOr404(id, userId, userRole);
    await this.doctorsBlacklistRepo.remove(entity);
  }
}
