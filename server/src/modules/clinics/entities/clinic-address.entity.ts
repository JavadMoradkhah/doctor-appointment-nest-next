import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Clinic } from './clinic.entity';

@Entity('clinic_addresses')
export class ClinicAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Clinic, (clinic) => clinic.address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @RelationId((clinicAddress: ClinicAddress) => clinicAddress.clinic)
  clinicId: number;

  @Column({ type: 'varchar', length: 255 })
  area: string;

  @Column({ type: 'text' })
  address: string;
}
