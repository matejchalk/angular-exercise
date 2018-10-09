import { Reservation } from './reservation.model';

export interface ReservationRow extends Reservation {
  selected: boolean;
}
