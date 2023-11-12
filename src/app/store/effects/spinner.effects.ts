import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap } from 'rxjs/operators';
import * as fromCustomerActions from '../../customer/state/customer.actions';
import * as fromGlJVActions from '../../modules/gledger/state/gledger.actions';


@Injectable()
export class SpinnerEffects {

  spinneron$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          fromCustomerActions.loadCustomers,
          fromCustomerActions.loadCustomer,
          fromGlJVActions.loadGledgers
        ),
        tap(() => this.spinner.show())
      ),
    { dispatch: false }
  );

  spinnerooff$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          fromCustomerActions.loadCustomerFailure,
          fromCustomerActions.loadCustomersFailure,
          fromCustomerActions.loadCustomerSuccess,
          fromCustomerActions.loadCustomersSuccess,
          fromGlJVActions.loadGledgersSucess),
        tap(() => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private spinner: NgxSpinnerService) { }

}
