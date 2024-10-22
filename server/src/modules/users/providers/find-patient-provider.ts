import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { ERR_MSG_USER_WAS_NOT_FOUND } from '../users.constants';

@Injectable()
export class FindPatientProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findOr404(id: number) {
    const doctor = await this.usersRepo.findOneBy({
      id: id,
      role: UserRole.PATIENT,
    });

    if (!doctor) {
      throw new NotFoundException(ERR_MSG_USER_WAS_NOT_FOUND);
    }

    return doctor;
  }

  async findOrForbid(id: number) {
    const doctor = await this.usersRepo.findOneBy({
      id: id,
      role: UserRole.PATIENT,
    });

    if (!doctor) {
      throw new ForbiddenException(ERR_MSG_USER_WAS_NOT_FOUND);
    }

    return doctor;
  }

  async findOrFail(id: number) {
    const doctor = await this.usersRepo.findOneBy({
      id: id,
      role: UserRole.PATIENT,
    });

    if (!doctor) {
      throw new BadRequestException(ERR_MSG_USER_WAS_NOT_FOUND);
    }

    return doctor;
  }
}
