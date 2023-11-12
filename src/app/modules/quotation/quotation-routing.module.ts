import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuotationCreateComponent } from './quotation-create/quotation-create.component';
import { QuotationDetailComponent } from './quotation-detail/quotation-detail.component';
import { QuotationEditComponent } from './quotation-edit/quotation-edit.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { QuotationPrintComponent } from './quotation-print/quotation-print.component';
import { CreateJoborderComponent } from './create-joborder/create-joborder.component';
import { TestobservablefindComponent } from './testobservablefind/testobservablefind.component';
import { QuoteTelComponent } from './quote-tel/quote-tel.component';

import { QuotationComponent } from './quotation.component';
import { QuoteteldtlComponent } from './quoteteldtl/quoteteldtl.component';
import { CustomertelComponent } from './quote-tel/customertel/customertel.component';

const routes: Routes = [
  {
    path: '', component: QuotationComponent, children: [
      { path: 'list', component: QuotationListComponent },
      { path: 'create', component: QuotationCreateComponent },
      { path: 'edit/:id', component: QuotationEditComponent },
      { path: 'detail', component: QuotationDetailComponent },
      { path: 'print', component: QuotationPrintComponent },
      { path: 'genjo/:id', component: CreateJoborderComponent },
      { path: 'test', component: TestobservablefindComponent },
      { path: 'gridtel', component: QuoteTelComponent },
      { path: 'custtel', component: CustomertelComponent },
      {path: 'twbtel',  component: QuoteteldtlComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
