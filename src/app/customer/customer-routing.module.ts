import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './component/customer-list/customer-list.component';
import { CustomerEditComponent } from './component/customer-edit/customer-edit.component';

import { CustomerComponent } from './customer.component';
import { GridFilteringComponent } from './component/grid-filtering/grid-filtering.component';
import { GridExcelStyleFilComponent } from './component/grid-excel-style-fil/grid-excel-style-fil.component';
import { IgxgridComboComponent } from './component/igxgrid-combo/igxgrid-combo.component';

const routes: Routes = [
  //{ path: 'customerlist', redirectTo: '/customerlist', pathMatch: 'full' },
  // {
  //   path: '', component: CustomerComponent, children: [

  //   ]
  // },
  { path: 'customer',component: CustomerComponent},
  { path: 'customerlist', component: CustomerListComponent },
  { path: 'customer-edit/:id', component: CustomerEditComponent },
  { path: 'gridfilter', component: GridExcelStyleFilComponent},
  { path: 'gridcombo', component: IgxgridComboComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
