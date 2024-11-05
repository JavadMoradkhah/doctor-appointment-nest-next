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
import { IsAdmin } from '../iam/authentication/decorators/is-admin.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateWorkingDayDto } from './dto/create-working-day.dto';
import { UpdateWorkingDayDto } from './dto/update-working-day.dto';
import { WorkingDaysService } from './working-days.service';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';

@ApiTags('Working Days')
@Controller('working_days')
export class WorkingDaysController {
  constructor(private readonly workingDaysService: WorkingDaysService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findAll(
    @ActiveUser('sub') userId: number,
    @IsAdmin() isAdmin: boolean,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.workingDaysService.findAll(isAdmin, userId, paginationQueryDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findOne(@Param('id') id: number, @ActiveUser('sub') userId: number) {
    return this.workingDaysService.findOne(id, userId);
  }

  @Post()
  @Roles(UserRole.DOCTOR)
  create(
    @ActiveUser('sub') userId: number,
    @Body() createWorkingDayDto: CreateWorkingDayDto,
  ) {
    return this.workingDaysService.create(userId, createWorkingDayDto);
  }

  @Put(':id')
  @Roles(UserRole.DOCTOR)
  update(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @Body() updateWorkingDayDto: UpdateWorkingDayDto,
  ) {
    return this.workingDaysService.update(id, userId, updateWorkingDayDto);
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @ActiveUser('sub') userId: number) {
    return this.workingDaysService.remove(id, userId);
  }
}
