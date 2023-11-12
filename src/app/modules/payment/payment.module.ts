import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { UpdatepaymentComponent } from './updatepayment/updatepayment.component';
import { ListpaymentComponent } from './listpayment/listpayment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewpaymentComponent } from './newpayment/newpayment.component';


@NgModule({
  declarations: [PaymentComponent, UpdatepaymentComponent, ListpaymentComponent, NewpaymentComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule
  ]
})
export class PaymentModule { }
