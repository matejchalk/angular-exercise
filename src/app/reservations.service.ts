import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Reservation, reservations } from './reservations';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  reservations$ = new BehaviorSubject<Reservation[]>(reservations);

  deleteReservation(id: number): Observable<number> {
    const i = reservations.findIndex(reservation => reservation.id === id);
    reservations.splice(i, 1);
    return of(i);
  }
}
