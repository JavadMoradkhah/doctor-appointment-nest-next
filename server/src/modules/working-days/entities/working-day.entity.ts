import { Expose } from 'class-transformer';
import { SerializerGroup } from 'src/common/enums/serializer-group.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Weekday } from '../enums/weekday.enum';

@Entity('working_days')
@Unique(['doctor', 'weekday'])
export class WorkingDay {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.workingDays, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctorId' })
  @Expose({ groups: [SerializerGroup.ADMIN] })
  doctor: Doctor;

  @RelationId((workingDay: WorkingDay) => workingDay.doctor)
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

  @CreateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  updatedAt: Date;

  @DeleteDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  deletedAt: Date;
}
