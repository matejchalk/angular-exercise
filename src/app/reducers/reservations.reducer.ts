import { Reservation } from '../models/reservation.model';
import {
  ReservationsAction,
  LoadReservations,
  LoadReservationsSuccess,
  LoadReservationsFail,
  DeleteReservationsSuccess
} from '../actions/reservations.action';

export interface ReservationsState {
  entities: { [id: number]: Reservation };
  loading: boolean;
  loaded: boolean;
}

export const initialState: ReservationsState = {
  entities: {},
  loading: false,
  loaded: false
};

export function reservationsReducer(state = initialState, action: ReservationsAction): ReservationsState {
  switch (action.type) {
    case LoadReservations.type: {
      return { ...state, loading: true, loaded: false };
    }
    case LoadReservationsSuccess.type: {
      const entities = action.reservations.reduce(
        (acc, reservation) => ({...acc, [reservation.id]: reservation}),
        {}
      );
      return { ...state, entities, loading: false, loaded: true };
    }
    case LoadReservationsFail.type: {
      return { ...state, loading: false, loaded: false };
    }
    case DeleteReservationsSuccess.type: {
      const entities = action.ids.reduce(
        (acc, id) => {
          const { [id]: removed, ...rest } = acc;
          return rest;
        },
        state.entities
      );
      return { ...state, entities };
    }
    default: {
      return state;
    }
  }
}
