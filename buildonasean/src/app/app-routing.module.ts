import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/authentication/authentication-guard';


const routes: Routes = [
  { path: '', 
  loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'login', 
  loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  { path: 'dashboard', 
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: 'supplier', loadChildren: () => import('./components/supplier/supplier.module').then(m => m.SupplierModule), canActivate: [AuthGuard]}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
