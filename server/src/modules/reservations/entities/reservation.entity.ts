import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Entity('reservations')
@Index(['patient', 'appointment', 'time'], {
  unique: true,
  where: `status = '${ReservationStatus.BOOKED}'`,
})
export class Reservation {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @RelationId((reservation: Reservation) => reservation.patient)
  patientId: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.reservations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @RelationId((reservation: Reservation) => reservation.appointment)
  appointmentId: number;

  @Column({ type: 'time without time zone' })
  time: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.BOOKED,
  })
  status: ReservationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  beforeInsertActions() {
    this.id = ulid();
  }
}
