import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuotationComponent } from './quotation.component';
import { DisplayFormatPipe, InputFormatPipe, QuotationCreateComponent } from './quotation-create/quotation-create.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { QuotationEditComponent } from './quotation-edit/quotation-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import * as fromQuotation from './state/quotation.reducer';
import { GermanLocale, QuotationDetailComponent } from './quotation-detail/quotation-detail.component';
import { QuotationPrintComponent } from './quotation-print/quotation-print.component';
import { CurrencyFormatterDirective } from 'src/app/shared/currency-formatter.directives';
import { QuotationConfirmComponent } from './quotation-confirm/quotation-confirm.component';
import { JoborderComponent } from './joborder/joborder.component';
import { CreateJoborderComponent } from './create-joborder/create-joborder.component';
import { TestobservablefindComponent } from './testobservablefind/testobservablefind.component';
import { QuoteTelComponent } from './quote-tel/quote-tel.component';
import { GridEditFormComponent } from './quote-tel/edit-form.components';
import { GridEditForm2Component } from './quote-tel/grid-edit-form2/grid-edit-form2.component';
import { QuoteteldtlComponent } from './quoteteldtl/quoteteldtl.component';
import { CeeditComponent } from './ceedit/ceedit.component';
import { CustformEditComponent } from './quote-tel/custform-edit/custform-edit.component';
import { CustomertelComponent } from './quote-tel/customertel/customertel.component';


@NgModule({
  declarations: [QuotationComponent, QuotationCreateComponent, QuotationListComponent, QuotationEditComponent, QuotationDetailComponent, QuotationPrintComponent, DisplayFormatPipe, GermanLocale,
    InputFormatPipe, CurrencyFormatterDirective, QuotationConfirmComponent, JoborderComponent, CreateJoborderComponent, TestobservablefindComponent, QuoteTelComponent, GridEditFormComponent, GridEditForm2Component, QuoteteldtlComponent, CeeditComponent, CustformEditComponent, CustomertelComponent],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromQuotation.quotationsFeatureKey, fromQuotation.reducer)
  ]
})
export class QuotationModule { }
