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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { DayOffsService } from './dayoffs.service';
import { CreateDayOffDto } from './dto/create-dayoff.dto';
import { UpdateDayOffDto } from './dto/update-dayoff.dto';

@ApiTags('dayoffs')
@Controller('dayoffs')
export class DayOffsController {
  constructor(private readonly dayOffsService: DayOffsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findAll(
    @ActiveUser('sub') userId: number,
    @ActiveUser('role') userRole: UserRole,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.dayOffsService.findAll(userId, userRole, paginationQueryDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
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
