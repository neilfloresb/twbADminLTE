import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerListComponent } from './customer/component/customer-list/customer-list.component';
import { CustomerModule } from './customer/customer.module';
import { StoreModule } from '@ngrx/store';
// import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { reducers, metaReducers } from './store';
import { SharedModule } from './shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { CustomerService } from './service/customer.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerEffects } from './store/effects/spinner.effects';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouteEffects } from './store/effects/route.effects';
import { AlertEffects } from './store/effects/alert.effects';
import { AlertModule } from 'ngx-alerts';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserComponent } from './user/user.component';
import { GljvService } from '../../src/app/service/gljv.service';
import { QuotationService } from './service/booktype.service';
import { QuoteService } from './service/quote.service';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { IgxExcelExporterService } from 'igniteui-angular';
import { PublicKeysService } from 'src/app/shared/public-keys.service';
import { EditService } from './modules/quotation/quote-tel/edit.service';

import { HttpClient } from '@angular/common/http';
import { CusteditService } from './modules/quotation/quote-tel/custedit.service';
import { BillingService } from '../app/service/billing.service';
import { PaymentService } from '../app/service/payment.service';

import { EditdtlBIllService } from './service/editdtl-bill.service';
import { EditbillService } from './service/editbill.service';
import { ReceivingComponent } from './receiving/receiving.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Loginv2Component } from './user/loginv2/loginv2.component';


@NgModule({
  declarations: [
    AppComponent,
    CustomerListComponent,
    LoginComponent,
    RegistrationComponent,
    UserComponent,
    ReceivingComponent,
    Loginv2Component

  ],

  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CustomerModule,
    NgxSpinnerModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000, position: 'right' }),
    // StoreModule.forRoot(reducers, {
    //   metaReducers
    // }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    SharedModule,
    EffectsModule.forRoot([SpinnerEffects, RouteEffects, AlertEffects])
  ],
  providers: [PublicKeysService, CustomerService, GljvService, QuotationService, QuoteService, CurrencyPipe, DecimalPipe, BillingService, PaymentService,
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    },
    {
      deps: [HttpClient],
      provide: EditService,
      useFactory: (jsonp: HttpClient) => () => new EditService(jsonp)
    },
    {
      deps: [HttpClient],
      provide: CusteditService,
      useFactory: (jsonp: HttpClient) => () => new CusteditService(jsonp)
    },
    {
      deps: [HttpClient],
      provide: EditdtlBIllService,
      useFactory: (jsonp: HttpClient) => () => new EditdtlBIllService(jsonp)
    },
    {
      deps: [HttpClient],
      provide: EditbillService,
      useFactory: (jsonp: HttpClient) => () => new EditbillService(jsonp)
    },
    , IgxExcelExporterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
