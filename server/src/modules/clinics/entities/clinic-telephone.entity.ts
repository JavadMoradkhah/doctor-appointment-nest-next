import { Expose } from 'class-transformer';
import { SerializerGroup } from 'src/common/enums/serializer-group.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { Clinic } from './clinic.entity';

@Entity('clinic-telephones')
@Unique(['clinic', 'telephone'])
export class ClinicTelephone {
  @PrimaryGeneratedColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  id: number;

  @ManyToOne(() => Clinic, (clinic) => clinic.telephones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @RelationId((clinicTelephone: ClinicTelephone) => clinicTelephone.clinic)
  clinicId: number;

  @Column({ type: 'varchar', length: 11 })
  telephone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
}
