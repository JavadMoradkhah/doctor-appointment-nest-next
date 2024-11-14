import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { SerializerGroup } from 'src/common/enums/serializer-group.enum';

@Entity('clinic-photos')
export class ClinicPhoto {
  @PrimaryGeneratedColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  id: number;

  @ManyToOne(() => Clinic, (clinic) => clinic.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @RelationId((clinicPhoto: ClinicPhoto) => clinicPhoto.clinic)
  clinicId: number;

  @Column({ type: 'varchar', length: 1024 })
  photo: string;

  @Exclude()
  @Column({ type: 'varchar', length: 1024 })
  photoKey: string;
}
