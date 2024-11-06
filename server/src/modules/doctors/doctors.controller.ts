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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RoleBasedSerializerInterceptor } from 'src/common/interceptors/role-based-serializer.interceptor';
import { ParseImageFilePipe } from 'src/common/pipes/parse-image-file.pipe';
import { ActiveUser } from '../iam/authentication/decorators/active-user.decorator';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @Roles()
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.doctorsService.findAll(paginationQueryDto);
  }

  @Get('me')
  @Roles(UserRole.DOCTOR)
  @UseInterceptors(RoleBasedSerializerInterceptor)
  me(@ActiveUser('sub') id: number) {
    return this.doctorsService.me(id);
  }

  @Get(':id')
  @Roles()
  @UseInterceptors(RoleBasedSerializerInterceptor)
  findOne(@Param('id') id: number) {
    return this.doctorsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.DOCTOR)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDoctorDto })
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @ActiveUser('sub') userId: number,
    @Body() createDoctorDto: CreateDoctorDto,
    @UploadedFile(ParseImageFilePipe({ fileIsRequired: false }))
    avatar: Express.Multer.File,
  ) {
    return this.doctorsService.create(userId, createDoctorDto, avatar);
  }

  @Patch('me')
  @Roles(UserRole.DOCTOR)
  updateMe(
    @ActiveUser('sub') id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.doctorsService.remove(id);
  }
}
