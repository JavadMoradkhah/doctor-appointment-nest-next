import { Expose } from 'class-transformer';
import { SerializerGroup } from 'src/common/enums/serializer-group.enum';
import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Doctor, (doctor) => doctor.office, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  doctor: Doctor;

  @RelationId((office: Office) => office.doctor)
  doctorId: number;

  @Column({ type: 'smallint', unique: true })
  officeNumber: number;

  @Column({ type: 'smallint' })
  floor: number;

  @CreateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  createdAt: Date;
}
