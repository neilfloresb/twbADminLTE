import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { merge, Observable, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/service/customer.service';
import { ICustomer } from 'src/app/shared/model/customer';
import { AppState } from 'src/app/store';
import * as fromCustomerSelectors from '../../state/customer.selector';
import * as fromCustomerActions from '../../state/customer.actions';
import { mergeMap } from 'rxjs/operators';
import { selectedCustomer } from '../../state/customer.selector';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit {

  public _customerDetail: ICustomer;
  _customerSubscription: Subscription;
  public _custid: number;

  isCustomerInStore$: Observable<boolean>;
  customer$: Observable<ICustomer>;
  //_customers$: Observable<Array<ICustomer>>;
  drdForm: FormGroup;
  constructor(private route: ActivatedRoute, private customerService: CustomerService, private store: Store<AppState>, private fb: FormBuilder) { }

  ngOnInit() {

    this.drdForm = this.fb.group({
      custid: [230012],
      custname: ['Philippines Energy Products Corporation'],
      cperson: ['SAMPLE MARCH'],
      cposition: ['UPDATED'],
      ccontact: ['09556776887'],
      emailadd: ['neilfloresb@gmail.com'],
      active_flag: ['Yes'],
    });

    const tempcust = {
      "custname": " Philippines Energy Products Corporation",
      "cperson": "TEST3",
      "cposition": "TEST3",
      "ccontact": "TEST3",
      "emailadd": "TEST3",
      "active_flag": "Yes"
    }

    this._custid = parseInt(this.route.snapshot.paramMap.get('id'))
    // if (this._custid) {
    //   this.store.dispatch(fromCustomerActions.loadCustomer({ id: this._custid }))
    //   //     this.loadCustomer(this._custid);
    // };

    // this.store
    // .pipe(select(selectedCustomer))
    // .subscribe(
    //     (customer_) =>
    //     {this._customerDetail = customer_,
    //     console.log(this._customerDetail)},
    //     (err) => console.log(err)
    //   );
    //this.loadCustomer(this._custid);

    this.isCustomerInStore$ = this.store.pipe(
      select(fromCustomerSelectors.entityExists, { id: this._custid })
    )

    this.customer$ = this.isCustomerInStore$.pipe(
      mergeMap((isCustomerInStore) => {
        if (!isCustomerInStore) {
          console.log('Get product from API');
          this.store.dispatch(
            fromCustomerActions.loadCustomer({ id: this._custid })
          );
        }
        return this.store.pipe(
          select(fromCustomerSelectors.selectEntityById, {
            id: this._custid,
          })
        );
      })
    );

    //console.log(this.isCustomerInStore$);

    // this.customer$ = this.store.pipe(
    //   select(fromCustomerSelectors.selectEntityById, {
    //     id: this._custid,
    //   })
    // );
  }

  loadCustomerDUMMY(_val: number) {
    this.isCustomerInStore$ = this.store.pipe(
      select(fromCustomerSelectors.entityExists, { id: _val })
    )

    this.customer$ = this.isCustomerInStore$.pipe(
      mergeMap((isCustomerInStore) => {
        if (!isCustomerInStore) {
          console.log('Get product from API');
          this.store.dispatch(
            fromCustomerActions.loadCustomer({ id: _val })
          );
        }
        return this.store.pipe(
          select(fromCustomerSelectors.selectEntityById, {
            id: _val,
          })
        );
      })
    );
  }

  InsertCustomer() {
    this.mapcustomerNewValue();
  }

  UpdateCustomer() {
    this.mapcustomerUpdateValue();
  }

  deleteCustomer() {
    const id: number = 230007
    this.store.dispatch(fromCustomerActions.deleteCustomer({ id }));
  }
  mapcustomerNewValue() {

    console.log(this.drdForm.value);
    this.store.dispatch(fromCustomerActions.addCustomer({ customer: this.drdForm.value }));
    //this.store.dispatch(add)
  }

  mapcustomerUpdateValue() {

    console.log(this.drdForm.value);
    this.store.dispatch(fromCustomerActions.upsertCustomer({ customer: this.drdForm.value }));
    //this.store.dispatch(add)
  }


  // loadingBehavior() {
  //   this._customers$ = this.customerService.customers$
  //   console.log(this.customer$);
  // }
  // loadCustomer(_val: number) {
  //   this._customerSubscription = this.customerService.getCustomerById(_val).subscribe(
  //     (_customerdetalye) => {
  //       this._customerDetail = _customerdetalye;
  //       console.log(this._customerDetail);

  //     },
  //     (err) => console.log(err))
  // }

  //}

  /** end of class */
}

