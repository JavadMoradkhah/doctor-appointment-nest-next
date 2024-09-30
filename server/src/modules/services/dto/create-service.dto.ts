import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  title: string;
}
