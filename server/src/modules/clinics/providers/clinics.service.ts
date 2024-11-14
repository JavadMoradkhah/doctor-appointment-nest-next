import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_ERROR_CODE_UNIQUE_VIOLATION } from 'src/common/constants/database.constants';
import { S3Folder } from 'src/common/enums/s3-folder.enum';
import { UploadService } from 'src/modules/upload/upload.service';
import { Repository } from 'typeorm';
import {
  ERR_MSG_CLINIC_ALREADY_EXISTS,
  ERR_MSG_CLINIC_TELEPHONE_ALREADY_EXISTS,
} from '../clinics.constants';
import { CreateClinicTelephoneDto } from '../dto/create-clinic-telephone.dto';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { ClinicPhoto } from '../entities/clinic-photo.entity';
import { ClinicTelephone } from '../entities/clinic-telephone.entity';
import { Clinic } from '../entities/clinic.entity';
import { UpdateClinicTelephoneDto } from '../dto/update-clinic-telephone.dto';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicsRepo: Repository<Clinic>,
    @InjectRepository(ClinicPhoto)
    private readonly clinicPhotosRepo: Repository<ClinicPhoto>,
    @InjectRepository(ClinicTelephone)
    private readonly clinicTelephonesRepo: Repository<ClinicTelephone>,
    private readonly uploadService: UploadService,
  ) {}

  async findOne() {
    const [clinic] = await this.clinicsRepo.find({
      select: {
        id: true,
        name: true,
        introduction: true,
        createdAt: true,
        updatedAt: true,
        address: {
          area: true,
          address: true,
        },
        telephones: {
          id: true,
          telephone: true,
          description: true,
        },
        photos: {
          id: true,
          photo: true,
        },
      },
      relations: {
        telephones: true,
        address: true,
        photos: true,
      },
      take: 1,
    });

    if (!clinic) {
      throw new NotFoundException();
    }

    return clinic;
  }

  async create(createClinicDto: CreateClinicDto) {
    const clinicsCount = await this.clinicsRepo.count();

    if (clinicsCount > 0) {
      throw new BadRequestException(ERR_MSG_CLINIC_ALREADY_EXISTS);
    }

    const clinic = this.clinicsRepo.create({
      name: createClinicDto.name,
      introduction: createClinicDto.introduction,
      address: {
        area: createClinicDto.address.area,
        address: createClinicDto.address.address,
      },
      telephones: createClinicDto.telephones.map((telephone) => ({
        telephone: telephone.telephone,
        ...(telephone.description && { description: telephone.description }),
      })),
    });

    return await this.clinicsRepo.save(clinic);
  }

  async update(id: number, updateClinicDto: UpdateClinicDto) {
    const clinic = await this.clinicsRepo.findOne({
      where: { id },
      relations: { address: true },
    });

    if (!clinic) {
      throw new NotFoundException();
    }

    clinic.name = updateClinicDto.name ?? clinic.name;
    clinic.introduction = updateClinicDto.introduction ?? clinic.introduction;
    clinic.address.area = updateClinicDto.address.area ?? clinic.address.area;
    clinic.address.address =
      updateClinicDto.address.address ?? clinic.address.address;

    return await this.clinicsRepo.save(clinic);
  }

  async addPhoto(id: number, file: Express.Multer.File) {
    const clinic = await this.clinicsRepo.findOneBy({ id });

    if (!clinic) {
      throw new NotFoundException();
    }

    const { Location, Key } = await this.uploadService.uploadFile(
      file,
      S3Folder.CLINIC_PHOTOS,
    );

    const photo = this.clinicPhotosRepo.create({
      clinic: { id: clinic.id },
      photo: Location,
      photoKey: Key,
    });

    return await this.clinicPhotosRepo.save(photo);
  }

  async removePhoto(id: number) {
    const photo = await this.clinicPhotosRepo.findOneBy({ id });

    if (!photo) {
      throw new NotFoundException();
    }

    await this.clinicPhotosRepo.remove(photo);

    await this.uploadService.deleteFile(photo.photoKey);
  }

  async addTelephone(id: number, createTelephoneDto: CreateClinicTelephoneDto) {
    const clinic = await this.clinicsRepo.findOneBy({ id });

    if (!clinic) {
      throw new NotFoundException();
    }

    try {
      const telephone = this.clinicTelephonesRepo.create({
        clinic: { id: clinic.id },
        telephone: createTelephoneDto.telephone,
        description: createTelephoneDto.description,
      });

      return await this.clinicTelephonesRepo.save(telephone);
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_CLINIC_TELEPHONE_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async updateTelephone(
    id: number,
    updateClinicTelephoneDto: UpdateClinicTelephoneDto,
  ) {
    const clinicTelephone = await this.clinicTelephonesRepo.findOneBy({ id });

    if (!clinicTelephone) {
      throw new NotFoundException();
    }

    clinicTelephone.telephone =
      updateClinicTelephoneDto.telephone ?? clinicTelephone.telephone;

    clinicTelephone.description =
      updateClinicTelephoneDto.description ?? clinicTelephone.description;

    try {
      return await this.clinicTelephonesRepo.save(clinicTelephone);
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_CLINIC_TELEPHONE_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async removeTelephone(id: number) {
    const telephone = await this.clinicTelephonesRepo.findOneBy({ id });

    if (!telephone) {
      throw new NotFoundException();
    }

    await this.clinicTelephonesRepo.remove(telephone);
  }
}
