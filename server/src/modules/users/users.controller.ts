import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationInterceptor } from 'src/common/interceptors/pagination.interceptor';
import { PaginationData } from 'src/common/types/pagination-data.interface';
import { ActiveUser } from 'src/modules/iam/authentication/decorators/active-user.decorator';
import { Roles } from 'src/modules/iam/authorization/decorators/roles.decorator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersListQueryDto } from './dto/users-list-query.dto';
import { UserRole } from './enums/user-role.enum';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll(@Query() query: UsersListQueryDto): Promise<PaginationData> {
    return this.usersService.findAll(query);
  }

  @Roles()
  @Get('profile')
  getProfile(@ActiveUser('sub') id: number) {
    return this.usersService.getProfile(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles()
  @Post('profile')
  createProfile(
    @ActiveUser('sub') id: number,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.usersService.createProfile(id, createProfileDto);
  }

  @Roles()
  @Patch('profile')
  updateProfile(
    @ActiveUser('sub') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Patch(':id/activate')
  activate(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('sub') userId: number,
  ) {
    return this.usersService.activate(id, userId);
  }

  @Patch(':id/deactivate')
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser('sub') userId: number,
  ) {
    return this.usersService.deactivate(id, userId);
  }
}
