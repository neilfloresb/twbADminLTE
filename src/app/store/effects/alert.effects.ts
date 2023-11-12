import { Injectable, ViewChild } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as fromCustomerActions from '../../customer/state/customer.actions';
import * as fromGlJVActions from '../../modules/gledger/state/gledger.actions';
import { AlertService } from 'ngx-alerts';
import { IgxDialogComponent } from 'igniteui-angular';



@Injectable()
export class AlertEffects {
  @ViewChild('alert', { static: true }) public alert: IgxDialogComponent;

  public message="";
  public alertitle="";

  unableToLoadCustomer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromCustomerActions.loadCustomersFailure),
        tap(() =>
          setTimeout(() => {
            this.alertService.warning('Unable to Load List of Customers');
          }, 1000)
        )
      ),
    { dispatch: false }
  );

  productUpsertSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromCustomerActions.upsertCustomerSuccess),
        tap(() =>
          setTimeout(() => {
            this.alertService.info('Customer Updated');
          }, 1000)
        )
      ),
    { dispatch: false }
  );

  unableToEditProduct$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromCustomerActions.upsertCustomerFailure),
        tap(() =>
          setTimeout(() => {
            this.alertService.info('Unable to edit customer');
          }, 1000)
        )
      ),
    { dispatch: false }
  );


 UpdateJvHeaderSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromGlJVActions.upsertJVHeaderSuccess, fromGlJVActions.addJVHeaderSuccess),
        tap(() =>
          setTimeout(() => {
            this.alertService.info('Successfully Save!!!');
          }, 1000)
        )
      ),
    { dispatch: false }
  );

 RemoveHeaderSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromGlJVActions.deleteJVHeaderSuccess),
        tap(() =>
          setTimeout(() => {
            this.alertService.info('Successfully Remove!!!');
          }, 1000)
        )
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private alertService: AlertService) {}

}
