import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import { reservationsReducer, ReservationsState } from './reservations.reducer';
import { reservationsViewReducer, ReservationsViewState } from './reservations-view.reducer';
import { currencyReducer, CurrencyState } from './currency.reducer';
import { loginReducer, LoginState } from './login.reducer';
import { languageReducer, LanguageState } from './language.reducer';

export interface State {
  login: LoginState,
  reservations: ReservationsState;
  reservationsView: ReservationsViewState;
  currency: CurrencyState;
  language: LanguageState;
}

export const reducers: ActionReducerMap<State> = {
  login: loginReducer,
  reservations: reservationsReducer,
  reservationsView: reservationsViewReducer,
  currency: currencyReducer,
  language: languageReducer
};

export const metaReducers: MetaReducer<State>[] = [loginMetaReducer];

export function loginMetaReducer(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: Action): State => {
    const value = localStorage.getItem('loggedIn');
    const loggedIn = value === null ? false : JSON.parse(value);
    const newState = reducer({ ...state, login: { loggedIn }}, action);
    localStorage.setItem('loggedIn', JSON.stringify(newState.login.loggedIn));
    return newState;
  };
}
