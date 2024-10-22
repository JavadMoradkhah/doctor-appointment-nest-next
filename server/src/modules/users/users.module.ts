import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from '../pagination/pagination.module';
import { User } from './entities/user.entity';
import { FindUserProvider } from './providers/find-user-provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PaginationModule],
  controllers: [UsersController],
  providers: [UsersService, FindUserProvider],
  exports: [UsersService, FindUserProvider],
})
export class UsersModule {}
