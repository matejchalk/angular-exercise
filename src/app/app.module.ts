import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FiltersComponent } from './filters/filters.component';
import { CardComponent } from './card/card.component';
import { NavComponent } from './nav/nav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { AppRoutingModule } from './app-routing.module';
import { NotImplementedComponent } from './not-implemented/not-implemented.component';
import { DropdownComponent } from './dropdown/dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    CheckboxComponent,
    FiltersComponent,
    CardComponent,
    NavComponent,
    ToolbarComponent,
    ReservationsComponent,
    NotImplementedComponent,
    DropdownComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
