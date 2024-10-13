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

  @Column({ type: 'enum', enum: Weekday })
  weekday: Weekday;

  @Column({ type: 'time without time zone' })
  startsAt: Date;

  @Column({ type: 'time without time zone' })
  endsAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
