import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../../../modules/reservations/entities/reservation.entity';
import { Schedule } from '../../../modules/schedules/entities/schedule.entity';
import { TimeSlot } from '../../../modules/time-slots/entities/time-slot.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('appointments')
@Index(['doctor', 'date'], { unique: true })
export class Appointment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Doctor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @RelationId((appointment: Appointment) => appointment.doctor)
  doctorId: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.appointments, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @RelationId((appointment: Appointment) => appointment.schedule)
  scheduleId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.appointment)
  reservations: Reservation[];

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.appointment)
  timeSlots: TimeSlot[];
}
