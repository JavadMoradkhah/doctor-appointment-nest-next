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
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateInsuranceDto } from './dto/create-insurance.dto';
import { UpdateInsuranceDto } from './dto/update-insurance.dto';
import { InsurancesService } from './insurances.service';

@ApiTags('insurances')
@Controller('insurances')
export class InsurancesController {
  constructor(private readonly insurancesService: InsurancesService) {}

  @Get()
  @Roles()
  findAll() {
    return this.insurancesService.findAll();
  }

  @Get(':id')
  @Roles()
  findOne(@Param('id') id: number) {
    return this.insurancesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createInsuranceDto: CreateInsuranceDto) {
    return this.insurancesService.create(createInsuranceDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: number,
    @Body() updateInsuranceDto: UpdateInsuranceDto,
  ) {
    return this.insurancesService.update(id, updateInsuranceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.insurancesService.remove(id);
  }
}
