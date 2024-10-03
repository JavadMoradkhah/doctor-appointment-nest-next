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

@Entity('schedules')
@Index(['doctor', 'day'], { unique: true })
export class Schedule {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;

  @RelationId((schedule: Schedule) => schedule.doctor)
  doctorId: number;

  @Column({ type: 'smallint' })
  day: number;

  @Column({ type: 'time without time zone' })
  startAt: Date;

  @Column({ type: 'time without time zone' })
  endAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
