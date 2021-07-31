import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { SharedModule } from '../shared.module';
import { BurnrateComponent } from './burnrate/burnrate.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PatientComponent } from './patients/patient.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    ChartsModule,
    FormsModule,
    MatSelectModule
  ],
  providers: [],
  declarations: [DashboardComponent, BurnrateComponent, PatientComponent]
})
export class DashboardModule { }