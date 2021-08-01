import { NgModule } from '@angular/core';

import { SupplierComponent } from './supplier.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SharedModule } from '../shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [
    SupplierRoutingModule, 
    SharedModule,
    MatPaginatorModule,
    MatChipsModule
  ],
  declarations: [SupplierComponent]
})
export class SupplierModule { }