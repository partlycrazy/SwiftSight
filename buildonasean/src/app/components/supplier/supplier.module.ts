import { NgModule } from '@angular/core';

import { SupplierComponent } from './supplier.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SharedModule } from '../shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    SupplierRoutingModule, 
    SharedModule,
    MatIconModule,
    MatPaginatorModule
  ],
  declarations: [SupplierComponent]
})
export class SupplierModule { }