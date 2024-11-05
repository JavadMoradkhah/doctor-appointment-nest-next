import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleBasedSerializerInterceptor } from 'src/common/interceptors/role-based-serializer.interceptor';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { DayOffsService } from './dayoffs.service';
import { CreateDayOffDto } from './dto/create-dayoff.dto';
import { UpdateDayOffDto } from './dto/update-dayoff.dto';
import { IsAdmin } from '../iam/authentication/decorators/is-admin.decorator';

@ApiTags('dayoffs')
@Controller('dayoffs')
export class DayOffsController {
  constructor(private readonly dayOffsService: DayOffsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findAll(
    @ActiveUser('sub') userId: number,
    @IsAdmin() isAdmin: boolean,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.dayOffsService.findAll(userId, isAdmin, paginationQueryDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findOne(
    @ActiveUser('sub') userId: number,
    @ActiveUser('role') userRole: UserRole,
    @Param('id') id: number,
  ) {
    return this.dayOffsService.findOne(userId, userRole, id);
  }

  @Post()
  @Roles(UserRole.DOCTOR)
  create(
    @ActiveUser('sub') userId: number,
    @Body() createDayOffDto: CreateDayOffDto,
  ) {
    return this.dayOffsService.create(userId, createDayOffDto);
  }

  @Put(':id')
  @Roles(UserRole.DOCTOR)
  update(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @Body() updateDayOffDto: UpdateDayOffDto,
  ) {
    return this.dayOffsService.update(id, userId, updateDayOffDto);
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @ActiveUser('sub') userId: number) {
    return this.dayOffsService.remove(id, userId);
  }
}
