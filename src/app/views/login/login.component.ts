import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../reducers';
import { Login } from '../../actions/login.action';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  constructor(private store: Store<State>) {}

  login(): void {
    this.store.dispatch(new Login());
  }
}
