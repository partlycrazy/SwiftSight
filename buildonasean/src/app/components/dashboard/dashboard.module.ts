import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { SharedModule } from '../shared.module';
import { BurnrateComponent } from './burnrate/burnrate.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HospitalsResolve } from 'src/app/core/http/hospital.resolve';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    ChartsModule,
    FormsModule,
    MatSelectModule
  ],
  providers: [HospitalsResolve],
  declarations: [DashboardComponent, BurnrateComponent]
})
export class DashboardModule { }