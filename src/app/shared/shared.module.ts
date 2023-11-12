import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { IgxButtonModule, IgxComboModule, IgxDatePickerModule, IgxDialogModule, IgxFocusModule, IgxGridModule, IgxIconModule, IgxInputGroupModule, IgxLayoutModule, IgxListModule, IgxMaskModule, IgxNavbarModule, IgxNavigationDrawerModule, IgxRadioModule, IgxRippleModule, IgxSelectModule, IgxSnackbarModule, IgxSwitchModule, IgxTabsModule, IgxTextSelectionModule, IgxToastModule, IgxToggleModule } from 'igniteui-angular';
import { TelerikReportingModule } from '@progress/telerik-angular-report-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GridBatchEditingWithTransactionsComponent} from '../shared/grid-transaction.component';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { FloatingLabelModule, LabelModule } from '@progress/kendo-angular-label';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
// import { CurrencyFormatterDirective } from '../shared/currency-formatter.directives';
// import { from } from 'rxjs';

// import { CustomerListComponent } from '../customer/component/customer-list/customer-list.component';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { AlertModule } from 'ngx-alerts';
// import { DialogModule } from '@progress/kendo-angular-dialog';
// import { GridModule } from '@progress/kendo-angular-grid';
// import { InputsModule } from '@progress/kendo-angular-inputs';
// import { LabelModule } from '@progress/kendo-angular-label';



@NgModule({
  declarations: [GridBatchEditingWithTransactionsComponent],
  imports: [
    CommonModule
  ],
  exports: [
    HttpClientModule,
    IgxNavigationDrawerModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule,
    IgxToggleModule,
    IgxIconModule,
    IgxRadioModule,
    IgxSwitchModule,
    IgxButtonModule,
    IgxDialogModule,
    IgxGridModule,
    IgxInputGroupModule,
    IgxDialogModule,
    IgxSelectModule,
    IgxToastModule,
    IgxListModule,
    IgxMaskModule,
    IgxDatePickerModule,
    IgxComboModule,
    TelerikReportingModule,
    IgxTabsModule,
    IgxSnackbarModule,
    IgxTextSelectionModule,
    IgxFocusModule,

    GridModule,
    DialogModule,
    InputsModule,
    LabelModule,
    DropDownsModule,
    HttpClientJsonpModule,
    FloatingLabelModule,

    FormsModule,
    ReactiveFormsModule,
    GridBatchEditingWithTransactionsComponent


    // GridModule,
    // DialogModule,
    // InputsModule,
    // LabelModule




  ]
})
export class SharedModule { }
