import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Login, LoginFailure, LoginSuccess, Logout, LogoutFailure, LogoutSuccess } from '../actions/login.action';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private router: Router
  ) {}

  @Effect()
  login$ = this.actions$.pipe(
    ofType(Login.type),
    map(() => new LoginSuccess()),
    catchError(() => of(new LoginFailure()))
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType(LoginSuccess.type),
    tap(() => {
      this.router.navigate(['']);
    })
  );

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(Logout.type),
    map(() => new LogoutSuccess()),
    catchError(() => of(new LogoutFailure()))
  );

  @Effect({ dispatch: false })
  logoutRedirect$ = this.actions$.pipe(
    ofType(LogoutSuccess.type),
    tap(() => {
      this.router.navigate(['login']);
    })
  );
}
