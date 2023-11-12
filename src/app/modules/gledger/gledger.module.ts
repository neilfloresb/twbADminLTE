import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GledgerRoutingModule } from './gledger-routing.module';
import { GledgerComponent } from './gledger.component';
import { GljvlistComponent } from './gljvlist/gljvlist.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {} from '../../../app/store/index';
import { StoreModule } from '@ngrx/store';
import * as fromGledger from './state/gledger.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GledgerEffects } from './state/gledger.effects';
import { GljvAddComponent } from './gljv-add/gljv-add.component';
import { GljvDetialsComponent } from './gljv-detials/gljv-detials.component';
import { GljvCREATEComponent } from './gljv-create/gljv-create.component';


@NgModule({
  declarations: [GledgerComponent, GljvlistComponent, GljvAddComponent, GljvDetialsComponent, GljvCREATEComponent],
  imports: [
    CommonModule,
    GledgerRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromGledger.gledgersFeatureKey, fromGledger.reducer),
    EffectsModule.forFeature([GledgerEffects])
  ]
})
export class GledgerModule { }
