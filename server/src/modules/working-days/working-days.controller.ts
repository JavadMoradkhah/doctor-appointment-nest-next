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
import { CreateWorkingDayDto } from './dto/create-working-day.dto';
import { UpdateWorkingDayDto } from './dto/update-working-day.dto';
import { WorkingDaysService } from './working-days.service';

@Roles(UserRole.DOCTOR)
@ApiTags('Working Days')
@Controller('working_days')
export class WorkingDaysController {
  constructor(private readonly workingDaysService: WorkingDaysService) {}

  @Get()
  findAll(@ActiveUser('sub') userId: number) {
    return this.workingDaysService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @ActiveUser('sub') userId: number) {
    return this.workingDaysService.findOne(id, userId);
  }

  @Post()
  create(
    @ActiveUser('sub') userId: number,
    @Body() createWorkingDayDto: CreateWorkingDayDto,
  ) {
    return this.workingDaysService.create(userId, createWorkingDayDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @Body() updateWorkingDayDto: UpdateWorkingDayDto,
  ) {
    return this.workingDaysService.update(id, userId, updateWorkingDayDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @ActiveUser('sub') userId: number) {
    return this.workingDaysService.remove(id, userId);
  }
}
