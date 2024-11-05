import { Expose } from 'class-transformer';
import { SerializerGroup } from 'src/common/enums/serializer-group.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { UserGender } from '../enums/user-gender.enum';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 11, unique: true })
  @Expose({ groups: [SerializerGroup.ADMIN, SerializerGroup.OWNER] })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  @Expose({ groups: [SerializerGroup.ADMIN, SerializerGroup.OWNER] })
  nationCode: string;

  @Column({ type: 'enum', enum: UserGender })
  gender: UserGender;

  @Column({ type: 'date' })
  @Expose({ groups: [SerializerGroup.ADMIN, SerializerGroup.OWNER] })
  dateOfBirth: Date;

  @Column({ type: 'boolean', default: true })
  @Expose({ groups: [SerializerGroup.ADMIN, SerializerGroup.OWNER] })
  isActive: boolean;

  @CreateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN, SerializerGroup.OWNER] })
  joinedAt: Date;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctor?: Doctor;
}
