import { ApiProperty } from '@nestjs/swagger';

export class CreateClinicPhoto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
