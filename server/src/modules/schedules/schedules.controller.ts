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
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@ApiTags('Schedules')
@Roles(UserRole.DOCTOR)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findAll(
    @ActiveUser('sub') userId: number,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.schedulesService.findDoctorAllSchedules(
      userId,
      paginationQueryDto,
    );
  }

  @Get(':id')
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findOne(@Param('id') id: number, @ActiveUser('sub') doctorId: number) {
    return this.schedulesService.findDoctorSchedule(id, doctorId);
  }

  @Post()
  create(
    @ActiveUser('sub') doctorId: number,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.schedulesService.create(doctorId, createScheduleDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @ActiveUser('sub') doctorId: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, doctorId, updateScheduleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @ActiveUser('sub') doctorId: number) {
    return this.schedulesService.remove(id, doctorId);
  }
}
