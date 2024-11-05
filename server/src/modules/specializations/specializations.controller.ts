import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { SpecializationsService } from './specializations.service';
import { CreateManySpecializationsDto } from './dto/create-many-specializations.dto';
import { RoleBasedSerializerInterceptor } from 'src/common/interceptors/role-based-serializer.interceptor';

@Roles(UserRole.ADMIN)
@ApiTags('specializations')
@Controller('specializations')
export class SpecializationsController {
  constructor(
    private readonly specializationsService: SpecializationsService,
  ) {}

  @Get()
  @Roles()
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findAll() {
    return this.specializationsService.findAll();
  }

  @Get(':id')
  @Roles()
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findOne(@Param('id') id: number) {
    return this.specializationsService.findOne(id);
  }

  @Post()
  create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationsService.create(createSpecializationDto);
  }

  @Post('create-many')
  createMany(
    @Body() createManySpecializationsDto: CreateManySpecializationsDto,
  ) {
    return this.specializationsService.createMany(createManySpecializationsDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateSpecializationDto: UpdateSpecializationDto,
  ) {
    return this.specializationsService.update(id, updateSpecializationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.specializationsService.remove(id);
  }
}
