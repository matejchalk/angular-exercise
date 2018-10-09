import { LoginAction, LoginSuccess, LogoutSuccess } from '../actions/login.action';

export interface LoginState {
  loggedIn: boolean;
}

const initialState: LoginState = {
  loggedIn: true
};

export function loginReducer(state = initialState, action: LoginAction) {
  switch (action.type) {
    case LoginSuccess.type: {
      const loggedIn = true;
      return { loggedIn };
    }
    case LogoutSuccess.type: {
      const loggedIn = false;
      return { loggedIn };
    }
    default:
      return state;
  }
}
