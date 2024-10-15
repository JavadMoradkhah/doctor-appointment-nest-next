import { Office } from 'src/modules/offices/entities/office.entity';
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
import { Degree } from '../../degrees/entities/degree.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Specialization } from '../../specializations/entities/specialization.entity';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'varchar', length: 50 })
  medicalSystemNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedules: Schedule[];

  @OneToOne(() => Office, (office) => office.doctor)
  office: Office;
}
