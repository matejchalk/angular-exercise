import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared.module';
import { PlatformRoutingModule } from './platform-routing.module';
import { MainComponent } from '../views/main/main.component';
import { FiltersComponent } from '../views/filters/filters.component';
import { ToolbarComponent } from '../views/toolbar/toolbar.component';
import { ReservationsComponent } from '../views/reservations/reservations.component';
import { CheckboxComponent } from '../components/checkbox/checkbox.component';
import { CardComponent } from '../components/card/card.component';
import { NavComponent } from '../components/nav/nav.component';
import { NotImplementedComponent } from '../components/not-implemented/not-implemented.component';
import { DropdownComponent } from '../components/dropdown/dropdown.component';

@NgModule({
  declarations: [
    MainComponent,
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
    SharedModule,
    PlatformRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PlatformModule { }
