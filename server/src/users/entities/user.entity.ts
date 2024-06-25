import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Profile } from './profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
