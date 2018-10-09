import { Action } from '@ngrx/store';

import { Reservation } from '../models/reservation.model';

export class LoadReservations implements Action {
  static readonly type: 'Load Reservations' = 'Load Reservations';
  readonly type = LoadReservations.type;
}

export class LoadReservationsFail implements Action {
  static readonly type: 'Load Reservations Fail' = 'Load Reservations Fail';
  readonly type = LoadReservationsFail.type;
  constructor(public error: any) {}
}

export class LoadReservationsSuccess implements Action {
  static readonly type: 'Load Reservations Success' = 'Load Reservations Success';
  readonly type = LoadReservationsSuccess.type;
  constructor(public reservations: Reservation[]) {}
}

export class DeleteReservations implements Action {
  static readonly type: 'Delete Reservations' = 'Delete Reservations';
  readonly type = DeleteReservations.type;
  constructor(public ids: number[]) {}
}

export class DeleteReservationsFail implements Action {
  static readonly type: 'Delete Reservations Fail' = 'Delete Reservations Fail';
  readonly type = DeleteReservationsFail.type;
  constructor(public error: any) {}
}

export class DeleteReservationsSuccess implements Action {
  static readonly type: 'Delete Reservations Success' = 'Delete Reservations Success';
  readonly type = DeleteReservationsSuccess.type;
  constructor(public ids: number[]) {}
}

export type ReservationsAction =
  | LoadReservations
  | LoadReservationsFail
  | LoadReservationsSuccess
  | DeleteReservations
  | DeleteReservationsFail
  | DeleteReservationsSuccess;
