import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, first, map, switchMap } from 'rxjs/operators';

import {
  LoadReservations,
  LoadReservationsFail,
  LoadReservationsSuccess,
  DeleteReservations,
  DeleteReservationsSuccess,
  DeleteReservationsFail
} from '../actions/reservations.action';
import { Reservation } from '../models/reservation.model';

@Injectable()
export class ReservationsEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  @Effect()
  requestReservations$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    filter(({ urlAfterRedirects }: NavigationEnd) => {
      const tree = this.router.parseUrl(urlAfterRedirects);
      const segments = tree.root.children.primary.segments;
      return segments.length > 0 && segments[0].path === 'reservations';
    }),
    first(),
    map(() => new LoadReservations())
  );

  @Effect()
  loadReservations$ = this.actions$.pipe(
    ofType(LoadReservations.type),
    switchMap(() => this.http.get<Reservation[]>('../../assets/reservations.json')),
    map(reservations => new LoadReservationsSuccess(reservations)),
    catchError(error => of(new LoadReservationsFail(error)))
  );

  @Effect()
  deleteReservations$ = this.actions$.pipe(
    ofType(DeleteReservations.type),
    map((action: DeleteReservations) => action.ids),
    map(ids => new DeleteReservationsSuccess(ids)),
    catchError(error => of(new DeleteReservationsFail(error)))
  );

}
