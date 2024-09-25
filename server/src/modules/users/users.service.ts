import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_ERROR_CODE_UNIQUE_VIOLATION } from 'src/common/constants/database.constants';
import { PaginationData } from 'src/common/types/pagination-data.interface';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersListQueryDto } from './dto/users-list-query.dto';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import {
  ERR_MSG_NATION_CODE_ALREADY_EXISTS,
  ERR_MSG_PROFILE_HAS_NOT_BEEN_CREATED,
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
    @InjectRepository(Profile)
    private readonly profilesRepo: Repository<Profile>,
  ) {}

  async findAll(query: UsersListQueryDto): Promise<PaginationData> {
    const [users, count] = await this.usersRepo.findAndCount({
      select: {
        id: true,
        phone: true,
        isActive: true,
        role: true,
        profile: {
          firstName: true,
          lastName: true,
          gender: true,
        },
      },
      relations: {
        profile: true,
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return { page: query.page, limit: query.limit, data: users, count: count };
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOne({
      where: {
        id,
      },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(ERR_MSG_USER_WAS_NOT_FOUND);
    }

    return user;
  }

  async getProfile(userId: number) {
    const profile = await this.usersRepo.findOne({
      relations: {
        profile: true,
      },
      where: {
        id: userId,
        profile: {
          id: Not(IsNull()),
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(ERR_MSG_PROFILE_HAS_NOT_BEEN_CREATED);
    }

    return profile;
  }

  async create({ phone, role }: CreateUserDto) {
    const userExists = await this.usersRepo.existsBy({ phone });

    if (userExists) {
      throw new ConflictException(ERR_MSG_USER_ALREADY_EXISTS);
    }

    const user = this.usersRepo.create({ phone, role });

    return await this.usersRepo.save(user);
  }

  async createProfile(userId: number, createProfileDto: CreateProfileDto) {
    try {
      const profile = await this.profilesRepo.save(
        this.profilesRepo.create({
          user: {
            id: userId,
          },
          ...createProfileDto,
        }),
      );

      return profile;
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_NATION_CODE_ALREADY_EXISTS);
      }
      throw error;
    }
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    try {
      let profile = await this.profilesRepo.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

      if (!profile) {
        throw new NotFoundException(ERR_MSG_PROFILE_HAS_NOT_BEEN_CREATED);
      }

      profile = Object.assign(profile, updateProfileDto);

      return this.profilesRepo.save(profile);
    } catch (error) {
      if (error.code === PG_ERROR_CODE_UNIQUE_VIOLATION) {
        throw new ConflictException(ERR_MSG_NATION_CODE_ALREADY_EXISTS);
      }
      throw error;
    }
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
