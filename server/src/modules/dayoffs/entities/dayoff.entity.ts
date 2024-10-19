import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity('day_offs')
@Index(['doctor', 'startDate', 'endDate'], { unique: true })
export class DayOff {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor;

  @RelationId((dayOff: DayOff) => dayOff.doctor)
  doctorId: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
