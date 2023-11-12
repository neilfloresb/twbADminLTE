import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { BillingComponent } from './billing.component';
import { BilCreateComponent } from './bil-create/bil-create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListBillingComponent } from './list-billing/list-billing.component';
import { DtlBillComponent } from './dtl-bill/dtl-bill.component';
import { DtleditformComponent } from './dtleditform/dtleditform.component';
import { NewbillComponent } from './newbill/newbill.component';


@NgModule({
  declarations: [BillingComponent, BilCreateComponent, ListBillingComponent, DtlBillComponent, DtleditformComponent, NewbillComponent],
  imports: [
    CommonModule,
    BillingRoutingModule,
    SharedModule
  ]
})
export class BillingModule { }
