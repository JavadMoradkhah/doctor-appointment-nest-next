import { Expose } from 'class-transformer';
import { SerializerGroup } from 'src/common/enums/serializer-group.enum';
import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctors-blacklist')
@Index(['doctor', 'patient'], { unique: true })
export class DoctorsBlacklist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctorId' })
  @Expose({ groups: [SerializerGroup.ADMIN] })
  doctor: Doctor;

  @RelationId((doctorsBlackList: DoctorsBlacklist) => doctorsBlackList.doctor)
  doctorId: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @RelationId((doctorsBlackList: DoctorsBlacklist) => doctorsBlackList.patient)
  patientId: number;

  @Column({ type: 'varchar', length: 255 })
  notes: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  updatedAt: Date;
}
