import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KustomerRoutingModule } from './kustomer-routing.module';
import { KustomerComponent } from './kustomer.component';


@NgModule({
  declarations: [KustomerComponent],
  imports: [
    CommonModule,
    KustomerRoutingModule
  ]
})
export class KustomerModule { }
