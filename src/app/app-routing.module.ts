import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/reservations'
  },
  {
    path: 'login',
    loadChildren: './superviews/landing.module#LandingModule'
  },
  {
    path: '',
    canLoad: [LoginGuard],
    loadChildren: './superviews/platform.module#PlatformModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [LoginGuard]
})
export class AppRoutingModule { }
