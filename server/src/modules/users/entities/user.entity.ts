import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserGender } from '../enums/user-gender.enum';
import { UserRole } from '../enums/user-role.enum';
import { Doctor } from 'src/modules/doctors/entities/doctor.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 11, unique: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

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

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctor?: Doctor;
}
