import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LoginComponent } from 'src/app/components/login/login.component';

@NgModule({
    declarations: [
        LoginComponent
    ],
  imports: [
      RouterModule,
      AppRoutingModule
  ],
  exports: [
  ]
})
export class NavModule { }