import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('services')
@Index(['doctor', 'title'], { unique: true })
export class Service {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.services, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @CreateDateColumn()
  createdAt: Date;
}
