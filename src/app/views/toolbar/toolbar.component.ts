import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, first, takeUntil } from 'rxjs/operators';

import { State } from '../../reducers';
import { Currency } from '../../reducers/currency.reducer';
import { UpdateReservationsFilters } from '../../actions/reservations-view.action';
import { ChangeCurrency } from '../../actions/currency.action';
import { $currencies, $currency } from '../../selectors/currency.selectors';
import { Logout } from '../../actions/login.action';
import { $language, $languages } from '../../selectors/language.selectors';
import { Language } from '../../reducers/language.reducer';
import { ChangeLanguage } from '../../actions/language.action';
import { $filters } from '../../selectors/reservations-view.selectors';

enum UserAction {
  LogOut = 'logOut'
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnDestroy {
  language$ = this.store.pipe(select($language));
  languages$ = this.store.pipe(select($languages));
  currency$ = this.store.pipe(select($currency));
  currencies$ = this.store.pipe(select($currencies));
  userActions = Object.values(UserAction);
  searchForm = this.formBuilder.group({ text: '' });
  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<State>,
    private formBuilder: FormBuilder
  ) {
    this.store.pipe(
      select($filters),
      first(),
    ).subscribe(filters => this.searchForm.setValue({ text: filters.text }));
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500)
      )
      .subscribe(value => this.store.dispatch(new UpdateReservationsFilters({ text: value.text })));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateLanguage(language: Language): void {
    this.store.dispatch(new ChangeLanguage(language));
  }

  updateCurrency(currency: Currency): void {
    this.store.dispatch(new ChangeCurrency(currency));
  }

  performUserAction(userAction: UserAction): void {
    switch (userAction) {
      case UserAction.LogOut:
        this.store.dispatch(new Logout());
        break;
    }
  }
}
