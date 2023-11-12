import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KustomerComponent } from './kustomer.component';

const routes: Routes = [{ path: '', component: KustomerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KustomerRoutingModule { }
