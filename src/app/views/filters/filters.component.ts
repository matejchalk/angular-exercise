import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { State } from '../../reducers';
import { $allLocations } from '../../selectors/reservations.selectors';
import { Filters, NumberFilter } from '../../reducers/reservations-view.reducer';
import { UpdateReservationsFilters } from '../../actions/reservations-view.action';
import { $filters } from '../../selectors/reservations-view.selectors';

interface DatePickOptions {
  thisWeek: boolean;
  thisMonth: boolean;
  plus3: boolean;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnDestroy {
  readonly initialGroup = {
    tripDate: this.formBuilder.group({
      checkInDate: null, checkOutDate: null
    }),
    status: this.formBuilder.group({
      accepted: false, expired: false,
      canceled: false, declined: false
    }),
    nights: this.formBuilder.group({
      one: false, two: false, three: false,
      four: false, five: false, overFive: false
    }),
    guests: this.formBuilder.group({
      one: false, two: false, three: false,
      four: false, five: false, overFive: false
    }),
    location: this.formBuilder.group({})
  };
  filtersForm = this.formBuilder.group(this.initialGroup);
  locations$ = this.store.pipe(
    select($allLocations),
    filter(locations => locations.length > 0),
    first()
  );
  datePickOptions: DatePickOptions = {
    thisWeek: false,
    thisMonth: false,
    plus3: false,
  };
  readonly ranges: { [key in keyof DatePickOptions]: [string, string] } = {
    thisWeek: [
      moment().startOf('week').format('YYYY-MM-DD'),
      moment().endOf('week').format('YYYY-MM-DD')
    ],
    thisMonth: [
      moment().startOf('month').format('YYYY-MM-DD'),
      moment().endOf('month').format('YYYY-MM-DD')
    ],
    plus3: [
      moment().subtract(3, 'days').format('YYYY-MM-DD'),
      moment().add(3, 'days').format('YYYY-MM-DD')
    ]
  };
  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<State>,
    private readonly formBuilder: FormBuilder
  ) {
    this.locations$
      .subscribe(locations => {
        this.filtersForm = this.formBuilder.group({
          ...this.initialGroup,
          location: this.formBuilder.group(
            locations.reduce((acc, location) => ({ ...acc, [location]: false }), {})
          )
        });
        this.store
          .pipe(
            select($filters),
            first()
          )
          .subscribe(filters => {
            this.filtersForm.setValue(this.importFilters(filters));
          });
        this.filtersForm.valueChanges
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(value => {
            this.datePickOptions = Object.keys(this.datePickOptions)
              .reduce((acc, key) => {
                  const date1 = value.tripDate.checkInDate + '..' + value.tripDate.checkOutDate;
                  const date2 = this.ranges[key].join('..');
                  return {...acc, [key]: date1 === date2};
                },
                {} as DatePickOptions
              );
            this.store.dispatch(new UpdateReservationsFilters(this.exportFilters(value)));
          });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectDatePickOption(option: keyof DatePickOptions): void {
    this.filtersForm.patchValue({
      tripDate: {
        checkInDate: this.ranges[option][0],
        checkOutDate: this.ranges[option][1]
      }
    });
  }

  clearAll(): void {
    this.filtersForm.setValue({
      tripDate: {
        checkInDate: null, checkOutDate: null
      },
      status: {
        accepted: false, expired: false,
        canceled: false, declined: false
      },
      nights: {
        one: false, two: false, three: false,
        four: false, five: false, overFive: false
      },
      guests: {
        one: false, two: false, three: false,
        four: false, five: false, overFive: false
      },
      location: Object.keys(this.filtersForm.value.location)
        .reduce((acc, key) => ({ ...acc, [key]: false }), {})
    });
  }

  clearTripDate(): void {
    this.filtersForm.patchValue({
      tripDate: {
        checkInDate: null,
        checkOutDate: null
      }
    });
  }

  importFilters(filters: Filters): any {
    const importNumberFilter = (numberFilter: NumberFilter): { [key: string]: boolean } => {
      const names = { [1]: 'one', [2]: 'two', [3]: 'three', [4]: 'four', [5]: 'five' };
      return {
        ...Object.values(names).reduce((acc, name) => ({ ...acc, [name]: false }), {}),
        ...numberFilter.values.reduce((acc, val) => ({ ...acc, [names[val]]: true}), {}),
        overFive: numberFilter.over === 5
      };
    };
    return {
      tripDate: filters.tripDate,
      status: filters.status,
      nights: importNumberFilter(filters.nights),
      guests: importNumberFilter(filters.guests),
      location: Object.keys(this.filtersForm.value.location)
        .reduce((acc, location) => ({ ...acc, [location]: filters.locations.includes(location) }), {})
    };
  }

  exportFilters(filters: any): any {
    const toNumberFilter = (formFilter: any): NumberFilter => {
      const possibleValues: [boolean, number][] = [
        [formFilter.one, 1], [formFilter.two, 2], [formFilter.three, 3], [formFilter.four, 4], [formFilter.five, 5]
      ];
      const values = possibleValues.filter(([on]) => on).map(([_, value]) => value);
      const over = formFilter.overFive ? 5 : null;
      return { values, over };
    };
    const tripDate = filters.tripDate;
    const status = filters.status;
    const nights = toNumberFilter(filters.nights);
    const guests = toNumberFilter(filters.guests);
    const locations = Object.entries(filters.location).filter(([_, isSelected]) => isSelected).map(([name]) => name);
    return { tripDate, status, nights, guests, locations };
  }
}
