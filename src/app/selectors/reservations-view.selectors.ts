import { createSelector } from '@ngrx/store';

import { State } from '../reducers';
import { Filters, NumberFilter, SortKey } from '../reducers/reservations-view.reducer';
import { $allReservations, $reservationsEntities } from './reservations.selectors';
import { Reservation, Status } from '../models/reservation.model';
import { ReservationRow } from '../models/reservation-row.model';

export const $reservationsView = (state: State) => state.reservationsView;

export const $filters = createSelector(
  $reservationsView,
  reservationsView => reservationsView.filters
);

const $sortKey = createSelector(
  $reservationsView,
  reservationsView => reservationsView.sortKey
);

export const $selected = createSelector(
  $reservationsView,
  reservationsView => reservationsView.selected
);

export const $currentPage = createSelector(
  $reservationsView,
  reservationsView => reservationsView.currentPage
);

export const $pageLimit = createSelector(
  $reservationsView,
  reservationsView => reservationsView.pageLimit
);

export const $filterTextOnly = createSelector(
  $filters,
  filters => filters.textOnly
);

export const $sortKeys = () => Object.values(SortKey);

export const $filteredReservations = createSelector(
  $allReservations,
  $filters,
  filterReservations
);

export const $filteredReservationsCount = createSelector(
  $filteredReservations,
  reservations => reservations.length
);

export const $sortedFilteredReservations = createSelector(
  $filteredReservations,
  $sortKey,
  sortReservations
);

export const $selectedReservations = createSelector(
  $reservationsEntities,
  $selected,
  (entities, selected) => selected.map(id => entities[id])
);

export const $sortedFilteredReservationRowsOnPage = createSelector(
  $currentPage,
  $pageLimit,
  $sortedFilteredReservations,
  $selected,
  (currentPage, pageLimit, reservations, selected): ReservationRow[] => {
    return reservations.slice(currentPage * pageLimit).slice(0, pageLimit).map(reservation => ({
      ...reservation,
      selected: selected.includes(reservation.id)
    }));
  }
);

export const $previousPageAvailable = createSelector(
  $currentPage,
  currentPage => currentPage > 0
);

export const $nextPageAvailable = createSelector(
  $currentPage,
  $pageLimit,
  $filteredReservationsCount,
  (currentPage, pageLimit, count) => {
    return currentPage < Math.ceil(count / pageLimit) - 1;
  }
);

/* helper functions */

function filterReservations(reservations: Reservation[], filters: Filters): Reservation[] {
  const filterFns: ((reservation: Reservation) => boolean)[] = [];
  filterFns.push(reservation => {
    const text = filters.text.toLowerCase();
    const fields = [
      reservation.listing.name,
      reservation.listing.location,
      ...reservation.travellers.map(traveller => traveller.name)
    ];
    return fields
      .map(field => field.toLowerCase())
      .some(field => field.includes(text));
  });
  if (!filters.textOnly) {
    if (filters.tripDate.checkInDate) {
      filterFns.push(reservation => reservation.tripDate.checkInDate >= filters.tripDate.checkInDate);
    }
    if (filters.tripDate.checkOutDate) {
      filterFns.push(reservation => reservation.tripDate.checkOutDate <= filters.tripDate.checkOutDate);
    }
    if (Object.values(filters.status).some(item => item)) {
      filterFns.push(reservation => {
        switch (reservation.status) {
          case Status.Accepted:
            return filters.status.accepted;
          case Status.Expired:
            return filters.status.expired;
          case Status.Canceled:
            return filters.status.canceled;
          case Status.Declined:
            return filters.status.declined;
        }
      });
    }
    const satisfiesNumberFilter = (value: number, filter: NumberFilter): boolean => {
      if (!filter.values.length && filter.over === null) {
        return true;
      }
      return filter.values.includes(value) || (filter.over !== null && value > filter.over);
    };
    filterFns.push(reservation => satisfiesNumberFilter(reservation.nights, filters.nights));
    filterFns.push(reservation => satisfiesNumberFilter(reservation.guests, filters.guests));
    if (filters.locations.length) {
      filterFns.push(reservation => filters.locations.includes(reservation.listing.location));
    }
  }
  return filterFns.reduce(
    (acc, filterFn) => acc.filter(filterFn),
    reservations
  );
}

function sortReservations(reservations: Reservation[], sortKey: SortKey): Reservation[] {
  if (!sortKey) {
    return reservations;
  }
  const fetchKey = (reservation: Reservation): (string | number)[] => {
    switch (sortKey) {
      case SortKey.TripDate:
        return [reservation.tripDate.checkInDate, reservation.tripDate.checkOutDate];
      case SortKey.ListingName:
        return [reservation.listing.name, reservation.listing.location];
      case SortKey.Travellers:
        return reservation.travellers.map(({name}) => name);
      case SortKey.Nights:
        return [reservation.nights];
      case SortKey.Guests:
        return [reservation.guests];
      case SortKey.Price:
        return [reservation.price];
      case SortKey.Status:
        return [reservation.status];
    }
  };
  const compareKeys = (res1: Reservation, res2: Reservation): number => {
    const keys = fetchKey(res1).map((value, index) => [value, fetchKey(res2)[index]]);
    return keys.reduce(
      (acc, [key1, key2]: [any, any]) => acc || (typeof key1 === 'string' ? key1.localeCompare(key2 as string) : key1 - key2),
      0);
  };

  return [...reservations].sort(compareKeys);
}
