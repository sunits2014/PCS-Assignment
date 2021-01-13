import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { LandingRouteModule } from './landing-route.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    LandingRouteModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule
  ]
})
export class LandingModule { }
