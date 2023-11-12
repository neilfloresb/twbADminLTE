import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListpaymentComponent } from './listpayment/listpayment.component';
import { NewpaymentComponent } from './newpayment/newpayment.component';

import { PaymentComponent } from './payment.component';
import { UpdatepaymentComponent } from './updatepayment/updatepayment.component';

//const routes: Routes = [{ path: '', component: PaymentComponent }];
const routes: Routes = [{
  path: '', component: PaymentComponent, children: [
    { path: 'create', component: NewpaymentComponent },
    { path: 'list', component: ListpaymentComponent },
    //  { path: 'dtl', component: DtlBillComponent },
    { path: 'update', component: UpdatepaymentComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
