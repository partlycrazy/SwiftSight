import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

const allModules = [
  CommonModule,
  MatCardModule,    
  MatGridListModule,
  MatTableModule,
  MatIconModule
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