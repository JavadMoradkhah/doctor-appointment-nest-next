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
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@Roles(UserRole.DOCTOR)
@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(
    @ActiveUser('sub') userId: number,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.create(userId, createServiceDto);
  }

  @Get(':id')
  findOne(@ActiveUser('sub') userId: number, @Param('id') id: number) {
    return this.servicesService.findOne(id, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @ActiveUser('sub') userId: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, userId, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @ActiveUser('sub') userId: number) {
    return this.servicesService.remove(id, userId);
  }
}
