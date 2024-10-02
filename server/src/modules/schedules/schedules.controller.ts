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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@Roles(UserRole.DOCTOR)
@ApiTags('schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  findAll(@ActiveUser('sub') userId: number) {
    return this.schedulesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @ActiveUser('sub') userId: number) {
    return this.schedulesService.findOne(id, userId);
  }

  @Post()
  create(
    @ActiveUser('sub') userId: number,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.schedulesService.create(userId, createScheduleDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, userId, updateScheduleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @ActiveUser('sub') userId: number) {
    return this.schedulesService.remove(id, userId);
  }
}
