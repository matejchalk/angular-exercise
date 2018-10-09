import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import {
  DeleteSelectedReservations,
  SelectFilteredReservations,
  SelectReservations,
  UpdateReservationsFilters,
  ClearReservations,
  ReloadState,
  FixParams,
  PreviousPage,
  NextPage,
  UpdateReservationsSortKey,
  ClearFilteredReservations, ToggleFilterTextOnlyFlag
} from '../actions/reservations-view.action';
import {
  $reservationsView,
  $currentPage,
  $filteredReservations,
  $pageLimit,
  $selectedReservations, $selected
} from '../selectors/reservations-view.selectors';
import { State } from '../reducers';
import { DeleteReservations, DeleteReservationsSuccess } from '../actions/reservations.action';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NumberFilter, ReservationsViewState } from '../reducers/reservations-view.reducer';

@Injectable()
export class ReservationsViewEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @Effect()
  reloadState$ = this.route.queryParams.pipe(
    map(queryParams => parseQueryParams(queryParams || {})),
    map(state => new ReloadState(state))
  );

  @Effect()
  fixParams$ = this.actions$.pipe(
    ofType(ReloadState.type, DeleteReservationsSuccess.type),
    withLatestFrom(this.store.pipe(select($currentPage))),
    withLatestFrom(this.store.pipe(select($pageLimit))),
    withLatestFrom(this.store.pipe(select($selected))),
    withLatestFrom(this.store.pipe(select($filteredReservations))),
    map(([[[[_, currentPage], pageLimit], selected], filtered]) => ({ currentPage, pageLimit, selected, filtered })),
    filter(({ currentPage, pageLimit, selected, filtered }) => {
      if (currentPage < 0 || currentPage >= Math.ceil(filtered.length / pageLimit)) {
        return true;
      }
      const filteredIDs = filtered.map(({id}) => id);
      return selected.filter(id => !filteredIDs.includes(id)).length > 0;
    }),
    map(({ filtered }) => new FixParams(filtered.map(({id}) => id)))
  );

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(
      FixParams.type,
      PreviousPage.type,
      NextPage.type,
      UpdateReservationsFilters.type,
      ToggleFilterTextOnlyFlag.type,
      UpdateReservationsSortKey.type,
      SelectReservations.type,
      ClearReservations.type,
      ClearFilteredReservations.type
    ),
    withLatestFrom(this.store.pipe(select($reservationsView))),
    tap(([_, state]) => {
      const queryParams = toQueryParams(state);
      this.router.navigate(['reservations'], { queryParams });
    })
  );

  @Effect()
  deleteSelectedReservations$ = this.actions$.pipe(
    ofType(DeleteSelectedReservations.type),
    withLatestFrom(this.store.pipe(select($selectedReservations))),
    map(([_, reservations]) => reservations.map(({id}) => id)),
    map(ids => new DeleteReservations(ids))
  );

  @Effect()
  selectFilteredReservations$ = this.actions$.pipe(
    ofType(SelectFilteredReservations.type),
    withLatestFrom(this.store.pipe(select($filteredReservations))),
    map(([_, reservations]) => reservations.map(({id}) => id)),
    map(ids => new SelectReservations(ids))
  );
}

function parseQueryParams(queryParams: Params): ReservationsViewState {
  const parseNumberFilter = (text: string): NumberFilter => {
    if (!text) {
      return { values: [], over: null };
    }
    const parts = text.split(',');
    const values = parts
      .map(part => +part)
      .filter(val => !isNaN(val));
    const over = parts
      .filter(part => part.startsWith('>'))
      .map(part => +part.slice(1))
      .find(val => !isNaN(val)) || null;
    return { values, over };
  };
  const parseUnsignedInt = (text: string, fallback: number): number => {
    const val = +text;
    if (!isNaN(val) && Number.isInteger(val) && val >= 0) {
      return val;
    }
    return fallback;
  };
  const reservationsView = {
    filters: {
      text: queryParams.text || '',
      tripDate: {
        checkInDate: queryParams.checkInDate || null,
        checkOutDate: queryParams.checkOutDate || null
      },
      status: {
        accepted: Boolean(queryParams.accepted),
        expired: Boolean(queryParams.expired),
        canceled: Boolean(queryParams.canceled),
        declined: Boolean(queryParams.declined)
      },
      nights: parseNumberFilter(queryParams.nights),
      guests: parseNumberFilter(queryParams.guests),
      locations: queryParams.locations ? queryParams.locations.split('---') : [],
      textOnly: Boolean(queryParams.textOnly)
    },
    sortKey: queryParams.sortKey || null,
    selected: queryParams.selected ? queryParams.selected.split(',').map(part => +part).filter(val => !isNaN(val)) : [],
    pageLimit: parseUnsignedInt(queryParams.pageLimit, 7),
    currentPage: parseUnsignedInt(queryParams.currentPage, 0)
  };
  return reservationsView;
}

function toQueryParams(state: ReservationsViewState): Params {
  const printNumberFilter = ({ values, over }: NumberFilter): string | undefined => {
    if (!values.length && over === null) {
      return undefined;
    }
    const arr = over === null ? values : [...values, '>' + over];
    return arr.join(',');
  };
  return {
    text: state.filters.text || undefined,
    checkInDate: state.filters.tripDate.checkInDate || undefined,
    checkOutDate: state.filters.tripDate.checkOutDate || undefined,
    accepted: state.filters.status.accepted ? '1' : undefined,
    expired: state.filters.status.expired ? '1' : undefined,
    canceled: state.filters.status.canceled ? '1' : undefined,
    declined: state.filters.status.declined ? '1' : undefined,
    nights: printNumberFilter(state.filters.nights),
    guests: printNumberFilter(state.filters.guests),
    locations: state.filters.locations.length ? state.filters.locations.join(',') : undefined,
    textOnly: state.filters.textOnly ? '1' : undefined,
    sortKey: state.sortKey || undefined,
    selected: state.selected.length ? state.selected.join(',') : undefined,
    pageLimit: state.pageLimit === 7 ? undefined : state.pageLimit,
    currentPage: state.currentPage === 0 ? undefined : state.currentPage,
  };
}
