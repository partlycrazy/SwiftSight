import { NgModule } from '@angular/core';

import { SupplierComponent } from './supplier.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SharedModule } from '../shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    SupplierRoutingModule, 
    SharedModule,
    MatIconModule
  ],
  declarations: [SupplierComponent]
})
export class SupplierModule { }