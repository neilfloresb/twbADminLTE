import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../admin/admin.guard';
import { ReceivingComponent } from '../receiving/receiving.component';

import { AdminboardComponent } from './adminboard.component';

const routes: Routes = [
  // { path: '', component: AdminboardComponent }
  {
    path: '', component: AdminboardComponent, children: [
      { path: 'customer', loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule), canLoad: [AdminGuard] },
      //  { path: 'apv', loadChildren: () => import('../modules/apv/apv.module').then(m => m.ApvModule), canLoad: [AdminGuard] },
      //  { path: 'gledger', loadChildren: () => import('../modules/gledger/gledger.module').then(m => m.GledgerModule), canLoad: [AdminGuard] },
      { path: 'quotation', loadChildren: () => import('../modules/quotation/quotation.module').then(m => m.QuotationModule), canActivate: [AdminGuard] },
      { path: 'billing', loadChildren: () => import('../modules/billing/billing.module').then(m => m.BillingModule) },
      { path: 'payment', loadChildren: () => import('../modules/payment/payment.module').then(m => m.PaymentModule) },
      { path: 'recv', component: ReceivingComponent }
    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminboardRoutingModule { }
