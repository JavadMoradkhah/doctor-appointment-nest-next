import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseDatePipe } from 'src/common/pipes/parse-date.pipe';
import { Roles } from 'src/modules/iam/authorization/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/enums/user-role.enum';
import { AvailabilityService } from './availability.service';

@Roles(UserRole.PATIENT)
@ApiTags('availability')
@Controller(':doctorId/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('dates')
  findDates(@Param('doctorId') doctorId: number) {
    return this.availabilityService.findDates(doctorId);
  }

  @Get(':date/times')
  findTimes(
    @Param('doctorId') doctorId: number,
    @Param('date', ParseDatePipe) date: Date,
  ) {
    return this.availabilityService.findTimes(doctorId, date);
  }
}
