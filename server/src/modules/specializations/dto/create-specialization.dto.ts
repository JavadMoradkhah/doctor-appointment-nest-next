import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { ERR_MSG_INVALID_SLUG } from '../specializations.consttants';

export class CreateSpecializationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: ERR_MSG_INVALID_SLUG,
  })
  slug: string;
}
