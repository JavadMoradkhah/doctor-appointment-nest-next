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
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleBasedSerializerInterceptor } from 'src/common/interceptors/role-based-serializer.interceptor';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { DegreesService } from './degrees.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { CreateManyDegreesDto } from './dto/create-many-degrees.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@Roles(UserRole.ADMIN)
@ApiTags('degrees')
@Controller('degrees')
export class DegreesController {
  constructor(private readonly degreesService: DegreesService) {}

  @Get()
  @Roles()
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findAll() {
    return this.degreesService.findAll();
  }

  @Get(':id')
  @Roles()
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findOne(@Param('id') id: number) {
    return this.degreesService.findOne(id);
  }

  @Post()
  create(@Body() createDegreeDto: CreateDegreeDto) {
    return this.degreesService.create(createDegreeDto);
  }

  @Post('create-many')
  createMany(@Body() createManyDegreesDto: CreateManyDegreesDto) {
    return this.degreesService.createMany(createManyDegreesDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDegreeDto: UpdateDegreeDto) {
    return this.degreesService.update(id, updateDegreeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.degreesService.remove(id);
  }
}
