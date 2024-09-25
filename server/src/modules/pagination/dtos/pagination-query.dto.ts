import { IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsPositive()
  @Max(24)
  @IsOptional()
  limit?: number = 10;

  @IsPositive()
  @IsOptional()
  page?: number = 1;
}
