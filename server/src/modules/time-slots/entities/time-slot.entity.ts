import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '../../../modules/appointments/entities/appointment.entity';

@Entity('time_slots')
@Unique(['appointment', 'time'])
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.timeSlots)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @RelationId((timeSlot: TimeSlot) => timeSlot.appointment)
  appointmentId: number;

  @Column({ type: 'time without time zone' })
  time: string;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
