import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';

export class UsersListQueryDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsIn([12, 24])
  @IsOptional()
  @Type(() => Number)
  limit: number = 12;
}
