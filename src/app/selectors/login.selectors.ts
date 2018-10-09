import { createSelector } from '@ngrx/store';
import { State } from '../reducers';

const $login = (state: State) => state.login;

export const $loggedIn = createSelector(
  $login,
  login => login.loggedIn
);
