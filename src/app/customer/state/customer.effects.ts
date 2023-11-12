import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, concatMap } from 'rxjs/operators';
import { CustomerService } from 'src/app/service/customer.service';
import * as fromCustomerAction from '../state/customer.actions';



@Injectable()
export class CustomerEffects {

  public _loading: boolean = true;

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomerAction.loadCustomers),
      mergeMap(() =>
        this.customerService.getCustomerForListing().pipe(
          map(customers =>
            fromCustomerAction.loadCustomersSuccess({ customers }),
            this._loading = false
          ),
          catchError(error =>
            of(fromCustomerAction.loadCustomersFailure({ error }))
          )
        )
      )
    )
  );

  loadCustomersANS$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomerAction.loadANSCustomers),
      mergeMap(() =>
        this.customerService.getCustomerForListingforANS().pipe(
          map(customers =>
            fromCustomerAction.loadANSCustomersSuccess({ customers }),
            this._loading = false
          ),
          catchError(error =>
            of(fromCustomerAction.loadANSCustomersFailure({ error }))
          )
        )
      )
    )
  );

  loadCustomer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromCustomerAction.loadCustomer),
      mergeMap((action) =>
        this.customerService.getCustomerById(action.id).pipe(
          map(customer =>
            fromCustomerAction.loadCustomerSuccess({ selectedCustomer: customer })
          ),
          catchError(error =>
            of(fromCustomerAction.loadCustomerFailure({ error }))))
      ),
    );
  });

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomerAction.addCustomer),
      mergeMap(action =>
        this.customerService.InsertCustomer(action.customer).pipe(
          map(customer => fromCustomerAction.addCustomerSucess({customer: customer})),
          catchError(error =>
            of(fromCustomerAction.addCustomerFailure({ error }))
          )
        )
      ),
  //    tap(() => this.router.navigate(["/product/list"]))
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomerAction.upsertCustomer),
      mergeMap((action) =>
        this.customerService.UpdateCustomer(action.customer).pipe(
          map((customer) =>
            fromCustomerAction.upsertCustomerSuccess({ customer })
          ),
          catchError((error) =>
            of(fromCustomerAction.upsertCustomerFailure({ error }))
          )
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomerAction.deleteCustomer),
      mergeMap(action =>
        this.customerService.deleteCustomer(action.id).pipe(
          map(() => fromCustomerAction.deleteCustomerSuccess({ id: action.id })),
          catchError(error =>
            of(fromCustomerAction.deleteCustomerFailure({ error }))
          )
        )
      ),
     // tap(() => this.router.navigate(["/product/list"])) // Not in Video 12
    )
  );

  // updateCustomer$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(fromCustomerAction.updateCustomer),
  //       concatMap(action =>
  //         this.customerService.UpdateCustomer(
  //           action.customer.id,
  //           action.customer.changes
  //         )
  //       ),
  //    //   tap(() => this.router.navigate(["/product/list"]))
  //     ),
  //   { dispatch: false }
  // );


  constructor(private actions$: Actions, private customerService: CustomerService) { }

}
