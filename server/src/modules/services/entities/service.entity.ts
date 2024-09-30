import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
