import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleBasedSerializerInterceptor } from 'src/common/interceptors/role-based-serializer.interceptor';
import { Roles } from 'src/modules/iam/authorization/decorators/roles.decorator';
import { ClinicsService } from '../providers/clinics.service';

@Roles()
@ApiTags('Clinics')
@Controller('clinics')
@UseInterceptors(RoleBasedSerializerInterceptor)
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  findOne() {
    return this.clinicsService.findOne();
  }
}
