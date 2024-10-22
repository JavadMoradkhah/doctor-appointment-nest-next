import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/iam/authorization/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/enums/user-role.enum';
import { AvailabilityService } from './availability.service';

@Roles(UserRole.PATIENT)
@ApiTags('availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get(':doctorId/dates')
  findDates(@Param('doctorId') doctorId: number) {
    return this.availabilityService.findDates(doctorId);
  }
}
