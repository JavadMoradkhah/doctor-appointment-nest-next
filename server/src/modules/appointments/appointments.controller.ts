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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateManyAppointmentsDto } from './dto/create-many-appointments.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findAll(
    @ActiveUser('sub') userId: number,
    @ActiveUser('role') userRole: UserRole,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.appointmentsService.findAll(userId, userRole, paginationQuery);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findOne(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @ActiveUser('role') userRole: UserRole,
  ) {
    return this.appointmentsService.findOne(id, userId, userRole);
  }

  @Post()
  @Roles(UserRole.DOCTOR)
  create(
    @ActiveUser('sub') userId: number,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(userId, createAppointmentDto);
  }

  @Post('bulk-create')
  @Roles(UserRole.DOCTOR)
  bulkCreate(
    @ActiveUser('sub') userId: number,
    @Body() createManyAppointmentsDto: CreateManyAppointmentsDto,
  ) {
    return this.appointmentsService.bulkCreate(
      userId,
      createManyAppointmentsDto,
    );
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR)
  update(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @ActiveUser('role') userRole: UserRole,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(
      id,
      userId,
      userRole,
      updateAppointmentDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @ActiveUser('role') userRole: UserRole,
  ) {
    return this.appointmentsService.remove(id, userId, userRole);
  }
}
