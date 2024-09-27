import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_ERROR_CODE_UNIQUE_VIOLATION } from 'src/common/constants/database.constants';
import { Repository } from 'typeorm';
import { ERR_MSG_NATIONAL_CODE_UNIQUENESS_VIOLATION } from '../iam/authentication/authentication.constants';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { PaginationService } from '../pagination/providers/pagination.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  ERR_MSG_NATION_CODE_ALREADY_EXISTS,
  ERR_MSG_USER_ALREADY_EXISTS,
  ERR_MSG_USER_WAS_NOT_FOUND,
  ERR_MSG_YOU_ARE_NOT_ALLOWED_TO_ACTIVATE_YOUR_OWN_ACCOUNT,
  ERR_MSG_YOU_ARE_NOT_ALLOWED_TO_DEACTIVATE_YOUR_OWN_ACCOUNT,
} from './users.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const [users, count] = await this.usersRepo.findAndCount({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        joinedAt: true,
      },
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    return this.paginationService.paginate(paginationQuery, users, count);
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(ERR_MSG_USER_WAS_NOT_FOUND);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.usersRepo.existsBy({
      phone: createUserDto.phone,
    });

    if (userExists) {
      throw new ConflictException(ERR_MSG_USER_ALREADY_EXISTS);
    }

    const nationCodeExists = await this.usersRepo.existsBy({
      nationCode: createUserDto.nationCode,
    });

    if (nationCodeExists) {
      throw new ConflictException(ERR_MSG_NATION_CODE_ALREADY_EXISTS);
    }

    const user = this.usersRepo.create(createUserDto);

    return await this.usersRepo.save(user);
  }

  async updateMe(userId: number, updateProfileDto: UpdateProfileDto) {
    try {
      let user = await this.findOne(userId);
      user = { ...user, ...updateProfileDto };
      return this.usersRepo.save(user);
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_NATIONAL_CODE_UNIQUENESS_VIOLATION);
      }
      throw error;
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(userId);

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const phoneExists = await this.usersRepo.existsBy({
        phone: updateUserDto.phone,
      });

      if (phoneExists) {
        throw new ConflictException(ERR_MSG_USER_ALREADY_EXISTS);
      }

      user.phone = updateUserDto.phone;
    }

    if (
      updateUserDto.nationCode &&
      updateUserDto.nationCode !== user.nationCode
    ) {
      const nationCodeExists = await this.usersRepo.existsBy({
        nationCode: updateUserDto.nationCode,
      });

      if (nationCodeExists) {
        throw new ConflictException(ERR_MSG_NATION_CODE_ALREADY_EXISTS);
      }

      user.nationCode = updateUserDto.nationCode;
    }

    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.gender = updateUserDto.gender ?? user.gender;
    user.dateOfBirth = updateUserDto.dateOfBirth ?? user.dateOfBirth;
    user.role = updateUserDto.role ?? user.role;

    return this.usersRepo.save(user);
  }

  async activate(userId: number, authenticatedUserId: number) {
    if (userId === authenticatedUserId) {
      throw new ForbiddenException(
        ERR_MSG_YOU_ARE_NOT_ALLOWED_TO_ACTIVATE_YOUR_OWN_ACCOUNT,
      );
    }

    const user = await this.findOne(userId);
    user.isActive = true;
    return this.usersRepo.save(user);
  }

  async deactivate(userId: number, authenticatedUserId: number) {
    if (userId === authenticatedUserId) {
      throw new ForbiddenException(
        ERR_MSG_YOU_ARE_NOT_ALLOWED_TO_DEACTIVATE_YOUR_OWN_ACCOUNT,
      );
    }

    const user = await this.findOne(userId);
    user.isActive = false;
    return await this.usersRepo.save(user);
  }
}
