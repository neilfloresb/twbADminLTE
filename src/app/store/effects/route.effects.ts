import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as fromCustomerActions from '../../customer/state/customer.actions';




@Injectable()
export class RouteEffects {
  goProductList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromCustomerActions.upsertCustomer),
        tap(() => this.route.navigate(['/customerlist']))
      ),
    { dispatch: false }
  );

  


  constructor(private actions$: Actions, private route: Router) {}

}
