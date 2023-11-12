import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GledgerComponent } from './gledger.component';
import { GljvAddComponent } from './gljv-add/gljv-add.component';
import { GljvCREATEComponent } from './gljv-create/gljv-create.component';
import { GljvlistComponent } from './gljvlist/gljvlist.component';

 const routes: Routes = [
   { path: '', component: GljvlistComponent },
   { path: 'create',component: GljvCREATEComponent},
   {path: 'edit', component: GljvAddComponent}

  ];
// const routes: Routes = [{
//   path: '', component: GljvAddComponent, children: [
//     {path: 'create', component: GljvCREATEComponent}
//   ]
// }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GledgerRoutingModule { }
