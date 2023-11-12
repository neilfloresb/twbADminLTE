import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApvComponent } from './apv.component';

const routes: Routes = [{ path: '', component: ApvComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApvRoutingModule { }
