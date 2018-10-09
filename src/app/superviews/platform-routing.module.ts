import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReservationsComponent } from '../views/reservations/reservations.component';
import { NotImplementedComponent } from '../components/not-implemented/not-implemented.component';
import { MainComponent } from '../views/main/main.component';
import { LoginGuard } from '../guards/login.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [LoginGuard],
    canActivateChild: [LoginGuard],
    children: [
      { path: 'reservations', component: ReservationsComponent },
      { path: '**', component: NotImplementedComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PlatformRoutingModule { }
