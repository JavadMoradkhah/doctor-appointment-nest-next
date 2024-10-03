import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Folder } from 'src/common/enums/s3-folder.enum';
import { Repository } from 'typeorm';
import { DegreesService } from '../degrees/degrees.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/providers/pagination.service';
import { SpecializationsService } from '../specializations/specializations.service';
import { UploadService } from '../upload/upload.service';
import { UserRole } from '../users/enums/user-role.enum';
import { UsersService } from '../users/users.service';
import {
  ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND,
  ERR_MSG_DOCTOR_WAS_NOT_FOUND,
  ERR_MSG_GIVEN_USER_IS_NOT_A_DOCTOR,
} from './doctors.constants';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorsRepo: Repository<Doctor>,
    private readonly paginationService: PaginationService,
    private readonly uploadService: UploadService,
    private readonly usersService: UsersService,
    private readonly specializationsService: SpecializationsService,
    private readonly degreesService: DegreesService,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto, userRole: UserRole) {
    const [doctors, count] = await this.doctorsRepo.findAndCount({
      select: {
        userId: true,
        avatar: true,
        user: {
          firstName: true,
          lastName: true,
          ...(userRole === UserRole.ADMIN && { phone: true }),
        },
        specialization: {
          id: true,
          title: true,
          slug: true,
        },
        degree: {
          id: true,
          title: true,
        },
      },
      relations: {
        user: true,
        specialization: true,
        degree: true,
      },
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    return this.paginationService.paginate(paginationQuery, doctors, count);
  }

  async findOne(id: number, userRole: UserRole) {
    const doctor = this.doctorsRepo.findOne({
      where: { userId: id },
      select: {
        userId: true,
        user: {
          firstName: true,
          lastName: true,
          ...(userRole === UserRole.ADMIN && { phone: true }),
          gender: true,
        },
        specialization: {
          id: true,
          title: true,
          slug: true,
        },
        degree: {
          id: true,
          title: true,
        },
        avatar: true,
        biography: true,
        medicalSystemNumber: true,
      },
      relations: {
        user: true,
        specialization: true,
        degree: true,
        services: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException(ERR_MSG_DOCTOR_WAS_NOT_FOUND);
    }

    return doctor;
  }

  async me(id: number) {
    const doctor = await this.doctorsRepo.findOne({
      where: { userId: id },
      relations: {
        user: true,
        specialization: true,
        degree: true,
        services: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException(ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND);
    }

    return doctor;
  }

  async create(
    userId: number,
    createDoctorDto: CreateDoctorDto,
    avatar?: Express.Multer.File,
  ) {
    const user = await this.usersService.findOne(userId);

    if (user.role !== UserRole.DOCTOR) {
      throw new BadRequestException(ERR_MSG_GIVEN_USER_IS_NOT_A_DOCTOR);
    }

    let avatarKey = null;
    let avatarLocation = null;

    const specialization = await this.specializationsService.findOne(
      createDoctorDto.specializationId,
    );

    const degree = await this.degreesService.findOne(createDoctorDto.degreeId);

    if (avatar) {
      const { Key, Location } = await this.uploadService.uploadFile(
        avatar,
        S3Folder.AVATARS,
      );

      avatarKey = Key;
      avatarLocation = Location;
    }

    const doctor = this.doctorsRepo.create({
      ...createDoctorDto,
      user: user,
      specialization: specialization,
      degree: degree,
      ...(avatarKey && { avatarKey }),
      ...(avatarLocation && { avatar: avatarLocation }),
    });

    return await this.doctorsRepo.save(doctor);
  }

  async update(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
    avatar?: Express.Multer.File,
  ) {
    const doctor = await this.doctorsRepo.findOneBy({ userId: id });

    if (!doctor) {
      throw new NotFoundException(ERR_MSG_DOCTOR_ACCOUNT_WAS_NOT_FOUND);
    }

    if (
      updateDoctorDto.specializationId &&
      updateDoctorDto.specializationId !== doctor.specialization.id
    ) {
      const specialization = await this.specializationsService.findOne(
        updateDoctorDto.specializationId,
      );

      doctor.specialization = specialization;
    }

    if (
      updateDoctorDto.degreeId &&
      updateDoctorDto.degreeId !== doctor.degree.id
    ) {
      const degree = await this.degreesService.findOne(
        updateDoctorDto.degreeId,
      );

      doctor.degree = degree;
    }

    if (avatar) {
      const { Key, Location } = await this.uploadService.uploadFile(
        avatar,
        S3Folder.AVATARS,
      );

      doctor.avatarKey = Key;
      doctor.avatar = Location;
    }

    doctor.biography = updateDoctorDto.biography ?? doctor.biography;

    doctor.defaultAppointmentsGap =
      updateDoctorDto.defaultAppointmentsGap ?? doctor.defaultAppointmentsGap;

    doctor.medicalSystemNumber =
      updateDoctorDto.medicalSystemNumber ?? doctor.medicalSystemNumber;

    return await this.doctorsRepo.save(doctor);
  }

  async remove(id: number) {
    const doctor = await this.doctorsRepo.findOneBy({ userId: id });

    if (!doctor) {
      throw new NotFoundException(ERR_MSG_DOCTOR_WAS_NOT_FOUND);
    }

    await this.doctorsRepo.remove(doctor);
  }
}
