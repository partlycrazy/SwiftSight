import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SupplierComponent } from './supplier/supplier.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'supplier', component: SupplierComponent, canActivate: [AuthGuard] }, 
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
