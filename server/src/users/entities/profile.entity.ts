import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserGender } from '../enums/user-gender.enum';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  nationCode: string;

  @Column({ type: 'enum', enum: UserGender })
  gender: UserGender;

  @Column({ type: 'date' })
  dateOfBirth: Date;
}
