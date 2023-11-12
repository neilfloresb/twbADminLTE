import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApvRoutingModule } from './apv-routing.module';
import { ApvComponent } from './apv.component';
import { ApvlistComponent } from './apvlist/apvlist.component';


@NgModule({
  declarations: [ApvComponent, ApvlistComponent],
  imports: [
    CommonModule,
    ApvRoutingModule
  ]
})
export class ApvModule { }
