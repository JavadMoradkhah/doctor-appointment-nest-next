import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormMimeType } from 'src/common/enums/form-mime-type.enum';
import { RoleBasedSerializerInterceptor } from 'src/common/interceptors/role-based-serializer.interceptor';
import { ParseImageFilePipe } from 'src/common/pipes/parse-image-file.pipe';
import { Roles } from 'src/modules/iam/authorization/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/enums/user-role.enum';
import { CreateClinicPhoto } from '../dto/create-clinic-photo.dto';
import { CreateClinicTelephoneDto } from '../dto/create-clinic-telephone.dto';
import { CreateClinicDto } from '../dto/create-clinic.dto';
import { UpdateClinicTelephoneDto } from '../dto/update-clinic-telephone.dto';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { ClinicsService } from '../providers/clinics.service';

@ApiTags('Clinics')
@Roles(UserRole.ADMIN)
@Controller('admin/clinics')
@UseInterceptors(RoleBasedSerializerInterceptor)
export class ClinicsAdminController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  create(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicsService.create(createClinicDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateClinicDto: UpdateClinicDto) {
    return this.clinicsService.update(id, updateClinicDto);
  }

  @Post(':id/photos')
  @ApiBody({ type: CreateClinicPhoto })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes(FormMimeType.MultipartFormData)
  addPhoto(
    @Param('id') id: number,
    @UploadedFile(ParseImageFilePipe()) file: Express.Multer.File,
  ) {
    return this.clinicsService.addPhoto(id, file);
  }

  @Delete('photos/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePhoto(@Param('id') id: number) {
    return this.clinicsService.removePhoto(id);
  }

  @Post(':id/telephones')
  addTelephone(
    @Param('id') id: number,
    @Body() createClinicTelephoneDto: CreateClinicTelephoneDto,
  ) {
    return this.clinicsService.addTelephone(id, createClinicTelephoneDto);
  }

  @Patch('telephones/:id')
  updateTelephone(
    @Param('id') id: number,
    @Body() updateClinicTelephoneDto: UpdateClinicTelephoneDto,
  ) {
    return this.clinicsService.updateTelephone(id, updateClinicTelephoneDto);
  }

  @Delete('telephones/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTelephone(@Param('id') id: number) {
    return this.clinicsService.removeTelephone(id);
  }
}
