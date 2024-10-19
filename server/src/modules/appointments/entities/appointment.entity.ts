import { IPostgresInterval } from 'postgres-interval';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'interval', nullable: true })
  appointmentsGap: IPostgresInterval;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
