import { Schedule } from 'src/modules/schedules/entities/schedule.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('appointments')
@Index(['doctor', 'date'], { unique: true })
export class Appointment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Doctor, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;

  @RelationId((appointment: Appointment) => appointment.doctor)
  doctorId: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.appointments, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  schedule: Schedule;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
