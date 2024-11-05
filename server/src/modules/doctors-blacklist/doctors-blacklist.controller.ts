import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleBasedSerializerInterceptor } from 'src/common/interceptors/role-based-serializer.interceptor';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { IsAdmin } from '../iam/authentication/decorators/is-admin.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { DoctorsBlacklistService } from './doctors-blacklist.service';
import { CreateDoctorsBlacklistDto } from './dto/create-doctors-blacklist.dto';
import { UpdateDoctorsBlacklistDto } from './dto/update-doctors-blacklist.dto';

@ApiTags('doctors-blacklist')
@Controller('doctors-blacklist')
export class DoctorsBlacklistController {
  constructor(
    private readonly doctorsBlacklistService: DoctorsBlacklistService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findAll(
    @ActiveUser('sub') userId: number,
    @IsAdmin() isAdmin: boolean,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.doctorsBlacklistService.findAll(
      userId,
      isAdmin,
      paginationQueryDto,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findOne(
    @ActiveUser('sub') userId: number,
    @IsAdmin() isAdmin: boolean,
    @Param('id') id: number,
  ) {
    return this.doctorsBlacklistService.findOne(id, userId, isAdmin);
  }

  @Post()
  @Roles(UserRole.DOCTOR)
  create(
    @ActiveUser('sub') userId: number,
    @Body() createDoctorsBlacklistDto: CreateDoctorsBlacklistDto,
  ) {
    return this.doctorsBlacklistService.create(
      userId,
      createDoctorsBlacklistDto,
    );
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR)
  update(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @IsAdmin() isAdmin: boolean,
    @Body() updateDoctorsBlacklistDto: UpdateDoctorsBlacklistDto,
  ) {
    return this.doctorsBlacklistService.update(
      id,
      userId,
      isAdmin,
      updateDoctorsBlacklistDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @IsAdmin() isAdmin: boolean,
  ) {
    return this.doctorsBlacklistService.remove(id, userId, isAdmin);
  }
}
