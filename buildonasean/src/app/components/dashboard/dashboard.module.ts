import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { SharedModule } from '../shared.module';
import { BurnrateComponent } from './burnrate/burnrate.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PatientComponent } from './patients/patient.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule,
    ChartsModule,
    FormsModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  providers: [],
  declarations: [DashboardComponent, BurnrateComponent, PatientComponent, ShipmentComponent]
})
export class DashboardModule { }