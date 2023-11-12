import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { StoreModule } from '@ngrx/store';
import * as fromCustomer from './state/customer.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CustomerEffects } from './state/customer.effects';
import { SharedModule } from '../shared/shared.module';
import { CustomerEditComponent } from './component/customer-edit/customer-edit.component';
import { GridFilteringComponent } from './component/grid-filtering/grid-filtering.component';
import { GridExcelStyleFilComponent } from './component/grid-excel-style-fil/grid-excel-style-fil.component';
import { IgxgridComboComponent } from './component/igxgrid-combo/igxgrid-combo.component';


@NgModule({
  declarations: [CustomerEditComponent, GridFilteringComponent,CustomerComponent, GridExcelStyleFilComponent, IgxgridComboComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    StoreModule.forFeature(
      fromCustomer.customersFeatureKey,
       fromCustomer.reducer),
    EffectsModule.forFeature([CustomerEffects]),

  ]
})
export class CustomerModule { }
