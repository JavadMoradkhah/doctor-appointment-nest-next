import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsPositive()
  @Max(24)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
}
