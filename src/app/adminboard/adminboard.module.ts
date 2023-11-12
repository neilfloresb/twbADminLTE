import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminboardRoutingModule } from './adminboard-routing.module';
import { AdminboardComponent } from './adminboard.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [AdminboardComponent],
  imports: [
    CommonModule,
    AdminboardRoutingModule,
    SharedModule
  ]
})
export class AdminboardModule { }
