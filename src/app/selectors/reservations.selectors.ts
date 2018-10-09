import { createSelector } from '@ngrx/store';

import { State } from '../reducers';

const $reservations = (state: State) => state.reservations;

export const $reservationsEntities = createSelector(
  $reservations,
  reservations => reservations.entities
);

export const $allReservations = createSelector(
  $reservationsEntities,
  Object.values
);

export const $allLocations = createSelector(
  $allReservations,
  reservations => reservations
    .map(({listing}) => listing)
    .map(({location}) => location)
    .filter((location, i, arr) => arr.indexOf(location) === i)
);
