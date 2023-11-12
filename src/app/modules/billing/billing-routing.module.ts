import { NgModule } from '@angular/core';
// import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';
import { Routes, RouterModule } from '@angular/router';
import { BilCreateComponent } from './bil-create/bil-create.component';

import { BillingComponent } from './billing.component';
import { DtlBillComponent } from './dtl-bill/dtl-bill.component';
import { ListBillingComponent } from './list-billing/list-billing.component';
import { NewbillComponent } from './newbill/newbill.component';

const routes: Routes = [{
  path: '', component: BillingComponent, children: [
    { path: 'makebill', component: NewbillComponent },
    { path: 'list', component: ListBillingComponent },
  //  { path: 'dtl', component: DtlBillComponent },
    { path: 'create/:id', component: BilCreateComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
