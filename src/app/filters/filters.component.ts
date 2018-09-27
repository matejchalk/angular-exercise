import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

interface DatePickOptions {
  thisWeek: boolean;
  thisMonth: boolean;
  plus3: boolean;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<any>();
  filtersForm: FormGroup = this.fb.group({
    tripDate: this.fb.group({
      checkInDate: null,
      checkOutDate: null
    }),
    status: this.fb.group({
      accepted: true,
      expired: true,
      canceled: true,
      declined: true
    }),
    nights: this.fb.group({
      oneNight: false,
      twoNights: false,
      threeNights: false,
      fourNights: false,
      fiveNights: false,
      overFiveNights: false
    }),
    guests: this.fb.group({
      oneGuest: false,
      twoGuests: false,
      threeGuests: false,
      fourGuests: false,
      fiveGuests: false,
      overFiveGuests: false
    }),
    listingName: this.fb.group({
      mesmerizing: false,
      groups1: false,
      japanese1: false,
      koenju: true,
      tokyo1: false,
      japanese2: false,
      groups2: false,
      tokyo2: false
    })
  });
  datePickOptions: DatePickOptions = {
    thisWeek: true,
    thisMonth: false,
    plus3: false,
  };
  unsubscribe$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.filtersForm.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        startWith(this.filtersForm.value)
      )
      .subscribe(value => {
        this.filtersChange.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

  selectDatePickOption(option: string): void {
    this.datePickOptions = Object.keys(this.datePickOptions)
      .reduce((acc, key) => ({...acc, [key]: key === option}), {} as DatePickOptions);
  }

  clearAll(): void {
    this.filtersForm.setValue({
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
      nights: {
        oneNight: false,
        twoNights: false,
        threeNights: false,
        fourNights: false,
        fiveNights: false,
        overFiveNights: false
      },
      guests: {
        oneGuest: false,
        twoGuests: false,
        threeGuests: false,
        fourGuests: false,
        fiveGuests: false,
        overFiveGuests: false
      },
      listingName: {
        mesmerizing: false,
        koenju: false,
        japanese1: false,
        japanese2: false,
        groups1: false,
        groups2: false,
        tokyo1: false,
        tokyo2: false
      }
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

}
