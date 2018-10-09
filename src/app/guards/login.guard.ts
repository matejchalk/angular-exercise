import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { State } from '../reducers';
import { $loggedIn } from '../selectors/login.selectors';

@Injectable()
export class LoginGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private store: Store<State>,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isLoggedIn();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isLoggedIn();
  }

  canLoad(route: Route): Observable<boolean> {
    return this.isLoggedIn();
  }

  private isLoggedIn(): Observable<boolean> {
    return this.store.pipe(
      select($loggedIn),
      map(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      }),
      first()
    );
  }
}
