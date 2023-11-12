import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { from } from 'rxjs';
// import { CustomerListComponent } from '../customer/component/customer-list/customer-list.component';
// import { CustomerComponent } from '../customer/customer.component';
import { SupplierComponent } from '../modules/supplier/supplier.component';

import { DashboardComponent } from './dashboard.component';
import { AdminGuard } from '../admin/admin.guard';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      // { path: 'customerlist', component: CustomerListComponent },
      { path: 'supplier', component: SupplierComponent },
      { path: 'customer', loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule), canLoad: [AdminGuard] },
      //   { path: 'apv', loadChildren: () => import('../modules/apv/apv.module').then(m => m.ApvModule), canLoad: [AdminGuard] },
      //  { path: 'gledger', loadChildren: () => import('../modules/gledger/gledger.module').then(m => m.GledgerModule), canLoad: [AdminGuard] },
      { path: 'quotation', loadChildren: () => import('../modules/quotation/quotation.module').then(m => m.QuotationModule), canActivate: [AdminGuard] },
      { path: 'billing', loadChildren: () => import('../modules/billing/billing.module').then(m => m.BillingModule) },
      { path: 'payment', loadChildren: () => import('../modules/payment/payment.module').then(m => m.PaymentModule) },
      // { path: 'bill', loadChildren: () => import('../modules/bill/bill.module').then(m => m.BillModule) },
      // { path: 'billing', loadChildren: () => import('../modules/billing/billing.module').thenm => m.BillingModule) },
    ]
  }
  // { path: 'quotation', loadChildren: () => import('../modules/quotation/quotation.module').then(m => m.QuotationModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
