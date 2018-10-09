import { Action } from '@ngrx/store';

export class Login implements Action {
  static readonly type: 'Login' = 'Login';
  readonly type = Login.type;
}

export class LoginFailure implements Action {
  static readonly type: 'Login Failure' = 'Login Failure';
  readonly type = LoginFailure.type;
}

export class LoginSuccess implements Action {
  static readonly type: 'Login Success' = 'Login Success';
  readonly type = LoginSuccess.type;
}

export class Logout implements Action {
  static readonly type: 'Logout' = 'Logout';
  readonly type = Logout.type;
}

export class LogoutFailure implements Action {
  static readonly type: 'Logout Failure' = 'Logout Failure';
  readonly type = LogoutFailure.type;
}

export class LogoutSuccess implements Action {
  static readonly type: 'Logout Success' = 'Logout Success';
  readonly type = LogoutSuccess.type;
}

export type LoginAction =
  | Login
  | LoginFailure
  | LoginSuccess
  | Logout
  | LogoutFailure
  | LogoutSuccess;

