import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { OfficesService } from './offices.service';

@ApiTags('offices')
@Roles(UserRole.ADMIN)
@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.officesService.findAll(paginationQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.officesService.findOne(id);
  }

  @Post()
  create(
    @Body(new ValidationPipe({ groups: [UserRole.ADMIN] }))
    createOfficeDto: CreateOfficeDto,
  ) {
    return this.officesService.create(createOfficeDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officesService.update(id, updateOfficeDto);
  }
}
