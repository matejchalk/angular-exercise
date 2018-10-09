import {
  ReservationsViewAction,
  UpdateReservationsFilters,
  UpdateReservationsSortKey,
  SelectReservations,
  ClearReservations,
  ClearFilteredReservations,
  PreviousPage,
  NextPage,
  ReloadState,
  FixParams, ToggleFilterTextOnlyFlag
} from '../actions/reservations-view.action';

export interface Filters {
  text: string;
  tripDate: {
    checkInDate: string | null;
    checkOutDate: string | null;
  };
  status: {
    accepted: boolean,
    expired: boolean,
    canceled: boolean,
    declined: boolean
  };
  nights: NumberFilter;
  guests: NumberFilter;
  locations: string[];
  textOnly: boolean;
}

export interface NumberFilter {
  values: number[];
  over: number | null;
}

export enum SortKey {
  TripDate = 'tripDate',
  ListingName = 'listingName',
  Travellers = 'travellers',
  Nights = 'nights',
  Guests = 'guests',
  Price = 'price',
  Status = 'status'
}

export interface ReservationsViewState {
  filters: Filters;
  sortKey: SortKey | null;
  selected: number[];
  pageLimit: number;
  currentPage: number;
}

export const initialState: ReservationsViewState = {
  filters: {
    text: '',
    tripDate: {
      checkInDate: null,
      checkOutDate: null
    },
    status: {
      accepted: false,
      expired: false,
      canceled: false,
      declined: false
    },
    nights: { values: [], over: null },
    guests: { values: [], over: null },
    locations: [],
    textOnly: false
  },
  sortKey: null,
  selected: [],
  pageLimit: 7,
  currentPage: 0
};

export function reservationsViewReducer(state = initialState, action: ReservationsViewAction): ReservationsViewState {
  switch (action.type) {
    case ReloadState.type: {
      return action.state;
    }
    case FixParams.type: {
      const lastPage = Math.ceil(action.filteredIDs.length / state.pageLimit) - 1;
      const currentPage = Math.max(0, Math.min(state.currentPage, lastPage));
      const selected = state.selected.filter(id => action.filteredIDs.includes(id));
      return { ...state, currentPage, selected };
    }
    case PreviousPage.type: {
      const currentPage = state.currentPage - 1;
      return { ...state, currentPage };
    }
    case NextPage.type: {
      const currentPage = state.currentPage + 1;
      return { ...state, currentPage };
    }
    case UpdateReservationsFilters.type: {
      const filters = { ...state.filters, ...action.filtersPatch };
      return { ...state, filters };
    }
    case ToggleFilterTextOnlyFlag.type: {
      const textOnly = !state.filters.textOnly;
      const filters = { ...state.filters, textOnly };
      return { ...state, filters };
    }
    case UpdateReservationsSortKey.type: {
      const sortKey = action.sortKey;
      return { ...state, sortKey };
    }
    case SelectReservations.type: {
      const selected = [
        ...state.selected,
        ...action.ids.filter(id => !state.selected.includes(id))
      ];
      return { ...state, selected };
    }
    case ClearReservations.type: {
      const selected = state.selected.filter(id => !action.ids.includes(id));
      return { ...state, selected };
    }
    case ClearFilteredReservations.type: {
      const selected = [];
      return {  ...state, selected };
    }
    default: {
      return state;
    }
  }
}


