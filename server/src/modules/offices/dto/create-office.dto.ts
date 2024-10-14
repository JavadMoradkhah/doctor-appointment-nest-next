import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { UserRole } from 'src/modules/users/enums/user-role.enum';

export class CreateOfficeDto {
  @IsNumber({}, { groups: [UserRole.ADMIN] })
  @IsInt({ groups: [UserRole.ADMIN] })
  @IsPositive({ groups: [UserRole.ADMIN] })
  @IsNotEmpty({ groups: [UserRole.ADMIN] })
  doctorId: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  officeNumber: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  floor: number;
}
