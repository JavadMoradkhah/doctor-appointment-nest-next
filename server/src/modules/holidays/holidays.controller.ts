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
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { CreateManyHolidaysDto } from './dto/create-many-holidays.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { HolidaysService } from './holidays.service';

@ApiTags('holidays')
@Roles(UserRole.ADMIN)
@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.holidaysService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.holidaysService.findOne(id);
  }

  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidaysService.create(createHolidayDto);
  }

  @Post('create-many')
  createMany(@Body() createManyHolidaysDto: CreateManyHolidaysDto) {
    return this.holidaysService.createMany(createManyHolidaysDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidaysService.update(id, updateHolidayDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.holidaysService.remove(id);
  }
}
