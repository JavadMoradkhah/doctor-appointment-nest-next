import { IPostgresInterval } from 'postgres-interval';
import { Degree } from 'src/modules/degrees/entities/degree.entity';
import { Schedule } from 'src/modules/schedules/entities/schedule.entity';
import { Service } from 'src/modules/services/entities/service.entity';
import { Specialization } from 'src/modules/specializations/entities/specialization.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctors')
export class Doctor {
  @OneToOne(() => User, (user) => user.doctor, {
    onDelete: 'RESTRICT',
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  user: User;

  @PrimaryColumn()
  @RelationId((doctor: Doctor) => doctor.user)
  userId: number;

  @ManyToOne(() => Specialization, {
    onDelete: 'RESTRICT',
  })
  specialization: Specialization;

  @ManyToOne(() => Degree, {
    onDelete: 'RESTRICT',
  })
  degree: Degree;

  @Column({ type: 'varchar', length: 512 })
  biography: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  avatar?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  avatarKey?: string;

  @Column({ type: 'interval' })
  defaultAppointmentsGap: IPostgresInterval;

  @Column({ type: 'varchar', length: 50 })
  medicalSystemNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Service, (service) => service.doctor)
  services: Service[];

  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedules: Schedule[];
}
