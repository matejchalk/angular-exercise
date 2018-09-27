import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReservationsComponent } from './reservations/reservations.component';
import { NotImplementedComponent } from './not-implemented/not-implemented.component';

const routes: Routes = [
  { path: '', redirectTo: '/reservations', pathMatch: 'full' },
  { path: 'reservations', component: ReservationsComponent },
  { path: '**', component: NotImplementedComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
