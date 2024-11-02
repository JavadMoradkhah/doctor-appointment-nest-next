import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from '../../../modules/appointments/entities/appointment.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Weekday } from '../enums/weekday.enum';

@Entity('schedules')
@Index(['doctor', 'weekday'], { unique: true })
export class Schedule {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;

  @RelationId((schedule: Schedule) => schedule.doctor)
  doctorId: number;

  @Column({ type: 'smallint', enum: Weekday })
  weekday: Weekday;

  @Column({ type: 'varchar', length: 50 })
  dayName: string;

  @Column({ type: 'time without time zone' })
  startsAt: string;

  @Column({ type: 'time without time zone' })
  endsAt: string;

  @Column({ type: 'time without time zone', nullable: true })
  breakStartsAt: string;

  @Column({ type: 'time without time zone', nullable: true })
  breakEndsAt: string;

  @Column({ type: 'smallint' })
  appointmentsDuration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.schedule)
  appointments: Appointment[];
}
