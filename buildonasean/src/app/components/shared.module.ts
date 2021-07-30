import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { HospitalsResolve } from '../core/http/hospital.resolve';

const allModules = [
  CommonModule,
  MatCardModule,    
  MatGridListModule,
  MatTableModule
]

@NgModule({
  imports: [
    ...allModules
  ],
  exports: [
    ...allModules
  ]
})
export class SharedModule { }