import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('otp')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 11 })
  phone: string;

  // bcrypt hashes length always are 60 characters long
  @Column({ type: 'varchar', length: 60 })
  otp: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'varchar', length: 50 })
  ip: string;

  @CreateDateColumn()
  createdAt: Date;
}
