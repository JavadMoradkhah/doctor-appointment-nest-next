import { Expose } from 'class-transformer';
import { SerializerGroup } from 'src/common/enums/serializer-group.enum';
import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
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

@Entity('schedules')
@Unique(['doctor', 'startDate', 'endDate'])
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'doctorId' })
  @Expose({ groups: [SerializerGroup.ADMIN] })
  doctor: Doctor;

  @RelationId((schedule: Schedule) => schedule.doctor)
  doctorId: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'interval' })
  appointmentsDuration: string;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  updatedAt: Date;
}
