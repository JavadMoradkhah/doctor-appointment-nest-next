import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinderProvider } from 'src/common/providers/finder.provider';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ERR_MSG_USER_WAS_NOT_FOUND } from '../users.constants';

@Injectable()
export class FindUserProvider implements FinderProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findOr404(id: number) {
    const doctor = await this.usersRepo.findOneBy({ id });

    if (!doctor) {
      throw new NotFoundException(ERR_MSG_USER_WAS_NOT_FOUND);
    }

    return doctor;
  }

  async findOrForbid(id: number) {
    const doctor = await this.usersRepo.findOneBy({ id });

    if (!doctor) {
      throw new ForbiddenException(ERR_MSG_USER_WAS_NOT_FOUND);
    }

    return doctor;
  }

  async findOrFail(id: number) {
    const doctor = await this.usersRepo.findOneBy({ id });

    if (!doctor) {
      throw new BadRequestException(ERR_MSG_USER_WAS_NOT_FOUND);
    }

    return doctor;
  }
}
