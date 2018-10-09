import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { LandingRoutingModule } from './landing-routing.module';
import { LoginComponent } from '../views/login/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
