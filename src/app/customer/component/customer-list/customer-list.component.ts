import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IgxDialogComponent, IgxGridCellComponent, IgxGridComponent, Transaction } from 'igniteui-angular';
import { Observable, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/service/customer.service';
import { ICustomer } from 'src/app/shared/model/Customer';
import { CustomerState } from '../../state/customer.reducer';
import { selectCustomers } from '../../state/customer.selector';
import * as fromCustomerActions from '../../state/customer.actions';
import { iCustomerINFOCRUD } from '../../../shared/model/customercrud';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  @ViewChild('grid1', { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;

  @ViewChild("dialogAdd", { read: IgxDialogComponent, static: true })
  public dialogAdd: IgxDialogComponent;


  //CUSTOMERDATA variable used before NGRX
  public _customerdata: ICustomer[];

  public _customerdata_;
  customerdata$: Observable<ICustomer[]>;
  // private customerdata$: new BehaviorSubject<ICustomer[]>([]);

  customerSubscription: Subscription;
  public _loading: boolean = true;

  public transactionsData: Transaction[] = [];
  public errors: any[];
  counter: number = 1;
  public branchval;
  public radioValues = ['yes', 'no'];
  public nullableRadioValues = ['yes', 'no', null];
  public data;

  constructor(private customerService: CustomerService, private store: Store<CustomerState>, private router: Router) { }

  //
  public value = 5;
  public percentage = 0.7;
  public formatOptions: any = {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'name'
  };
  //

  ngOnInit() {
    this.loadCustomerUsingNGRX();
    this._loading = false;
    this._customerdata_ = new iCustomerINFOCRUD();

    /**  GRID TRANSACTION  */
    this.transactionsData = this.transactions.getAggregatedChanges(true);
    this.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.transactions.getAggregatedChanges(true);
    });
  }

  ngOnDestroy() {
    this.customerSubscription.unsubscribe();
  }

  loadCustomerUsingNGRX() {
    this.branchval = JSON.parse(localStorage.getItem('entity'));

    if (this.branchval == "TWINBEE") {
      this.store.dispatch(fromCustomerActions.loadCustomers());
      this.loadCustomers();

      this.twinbeeSubscription();
    } else if (this.branchval == "ANS") {
      this.store.dispatch(fromCustomerActions.loadANSCustomers());
      this.loadCustomers();

      this.ansSubscription();
    }
  }

  public get transactions() {
    return this.grid1.transactions;
  }

  public get hasTransactions(): boolean {
    return this.grid1.transactions.getAggregatedChanges(false).length > 0;
  }

  loadCustomers() {
    this.customerdata$ = this.store.pipe(select(selectCustomers));
    console.log(this.customerdata$);
  }

  twinbeeSubscription() {
    this.customerSubscription = this.customerService.getCustomerForListing()
      .subscribe((res) => {
        this._customerdata = res;
        //     console.log(this._customerdata);
      },
        (err) => console.log(err)
      )
  }
  ansSubscription() {
    this.customerSubscription = this.customerService.getCustomerForListingforANS()
      .subscribe((res) => {
        this._customerdata = res;
        //     console.log(this._customerdata);
      },
        (err) => console.log(err)
      )
  }

  public View(event, rowID) {
    this.router.navigate(['/home/customer/customer-edit', rowID]);
  }

  public handleRadioSelection(value, cell: IgxGridCellComponent): void {
    cell.update(value);
    this.data = value;
    console.log(this.data);
  }

  handleSelection(event) {

    const targetCell = event.cell as IgxGridCellComponent;
    this.grid1.selectRows([targetCell.row.rowID], true)
  }

  Savecustomer() {
    let addResult: { [id: number]: ICustomer };

    this.customerService
      .CustomerTransactionCrud(this.grid1.transactions.getAggregatedChanges(true))
      .subscribe(
        (res) => {
          if (res) {
            addResult = res;
            //    console.log(res);
          }
        },
        (err) => (this.errors = err),
        () => {
          // all done, commit transactions
          this.grid1.transactions.commit(this._customerdata);
          if (!addResult) {
            return;
          }
          // update added records IDs with ones generated from backend
          for (const id of Object.keys(addResult)) {
            const item = this._customerdata.find(
              (x) => x.custid === parseInt(id, 10)
            );
            item.custid = addResult[id].custid;
          }
          this._customerdata = [...this._customerdata];
        }
      );
    this._customerdata_ = new iCustomerINFOCRUD();
    this.loadCustomerUsingNGRX();
    //   this.JVinitialize();
    // this.SaveHdrEmit.emit();
  }
  public addRow() {

    this.grid1.addRow({
      custid: this.counter++,
      custmain: this._customerdata_.custmain,
      custname: this._customerdata_.custmain,
      cperson: this._customerdata_.cperson,
      ccontact: this._customerdata_.ccontact,
      cposition: this._customerdata_.cposition,
      emailadd: this._customerdata_.emailadd,
      cperson2: this._customerdata_.cperson2,
      ccontact2: this._customerdata_.ccontact2,
      tin: this._customerdata_.tin,
      active_flag: 'yes',
      entity: JSON.parse(localStorage.getItem('entity')),
    })
    //   console.log(this.grid1.addRow);
    this.closeadd();
  }

  public cancel() {
    this.dialogAdd.close();
  }
  public closeadd() {
    this.dialogAdd.close();
  }

}
