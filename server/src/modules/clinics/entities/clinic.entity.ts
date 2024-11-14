import { Expose } from 'class-transformer';
import { SerializerGroup } from 'src/common/enums/serializer-group.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClinicAddress } from './clinic-address.entity';
import { ClinicPhoto } from './clinic-photo.entity';
import { ClinicTelephone } from './clinic-telephone.entity';

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  introduction: string;

  @CreateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose({ groups: [SerializerGroup.ADMIN] })
  updatedAt: Date;

  @OneToMany(
    () => ClinicTelephone,
    (clinicTelephone) => clinicTelephone.clinic,
    { cascade: ['insert'] },
  )
  telephones: ClinicTelephone[];

  @OneToMany(() => ClinicPhoto, (clinicPhoto) => clinicPhoto.clinic)
  photos: ClinicPhoto[];

  @OneToOne(() => ClinicAddress, (clinicAddress) => clinicAddress.clinic, {
    cascade: true,
  })
  address: ClinicAddress;
}
