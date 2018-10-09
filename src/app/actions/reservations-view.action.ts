import { Action } from '@ngrx/store';

import { ReservationsViewState, SortKey } from '../reducers/reservations-view.reducer';

export class ReloadState implements Action {
  static readonly type: 'Reload State' = 'Reload State';
  readonly type = ReloadState.type;
  constructor(public state: ReservationsViewState) {}
}

export class FixParams implements Action {
  static readonly type: 'Fix Params' = 'Fix Params';
  readonly type = FixParams.type;
  constructor(public filteredIDs: number[]) {}
}

export class PreviousPage implements Action {
  static readonly type: 'Previous Page' = 'Previous Page';
  readonly type = PreviousPage.type;
}

export class NextPage implements Action {
  static readonly type: 'Next Page' = 'Next Page';
  readonly type = NextPage.type;
}

export class DeleteSelectedReservations implements Action {
  static readonly type: 'Delete Selected Reservations' = 'Delete Selected Reservations';
  readonly type = DeleteSelectedReservations.type;
}

export class UpdateReservationsFilters implements Action {
  static readonly type: 'Update Reservations Filters' = 'Update Reservations Filters';
  readonly type = UpdateReservationsFilters.type;
  constructor(public filtersPatch: any) {}
}

export class ToggleFilterTextOnlyFlag implements Action {
  static readonly type: 'Toggle Filter Text Only Flag' = 'Toggle Filter Text Only Flag';
  readonly type = ToggleFilterTextOnlyFlag.type;
}

export class UpdateReservationsSortKey implements Action {
  static readonly type: 'Update Reservations Sort Key' = 'Update Reservations Sort Key';
  readonly type = UpdateReservationsSortKey.type;
  constructor(public sortKey: SortKey) {}
}

export class SelectReservations implements Action {
  static readonly type: 'Select Reservations' = 'Select Reservations';
  readonly type = SelectReservations.type;
  constructor(public ids: number[]) {}
}

export class ClearReservations implements Action {
  static readonly type: 'Clear Reservations' = 'Clear Reservations';
  readonly type = ClearReservations.type;
  constructor(public ids: number[]) {}
}

export class SelectFilteredReservations implements Action {
  static readonly type: 'Select Filtered Reservations' = 'Select Filtered Reservations';
  readonly type = SelectFilteredReservations.type;
}

export class ClearFilteredReservations implements Action {
  static readonly type: 'Clear Filtered Reservations' = 'Clear Filtered Reservations';
  readonly type = ClearFilteredReservations.type;
}

export type ReservationsViewAction =
  | ReloadState
  | FixParams
  | PreviousPage
  | NextPage
  | DeleteSelectedReservations
  | UpdateReservationsFilters
  | ToggleFilterTextOnlyFlag
  | UpdateReservationsSortKey
  | SelectReservations
  | ClearReservations
  | SelectFilteredReservations
  | ClearFilteredReservations;
