import { Component, Inject, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable, EMPTY } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { CusteditService } from '../custedit.service';
import { Customer, ICustomer } from '../icustomer';

@Component({
  selector: 'app-customertel',
  templateUrl: './customertel.component.html',
  styleUrls: ['./customertel.component.scss']
})
export class CustomertelComponent implements OnInit {

  errorMessage = '';

  public custView: Observable<GridDataResult>;
 // public custView2: ICustomer[];


  public gridState: State = {
    sort: [],
    skip: 0,
    take: 20,
    // Initial filter descriptor
    filter: {
      logic: "and",
      filters: [{ field: "custname", operator: "contains", value: "" }],}
  };

  public custDataItem: ICustomer;
  public isNew: boolean;

  private custeditService: CusteditService;

  constructor(@Inject(CusteditService) custeditServiceFactory: any) {
    this.custeditService = custeditServiceFactory();
  }

  //DECLARATIVE RETRIEVING DATA
  // getAllCustomer$ = this.custService.customers$.pipe(
  //   // tap((data) => console.log('getProducts 2022: ', JSON.stringify(data))),
  //   catchError((error) => {
  //     this.errorMessage = error;
  //     return EMPTY;
  //   })
  // );


  // customers$ = this.custService.customers$.pipe(
  //   map(value => value),
  //   tap(value => console.log('DECLARATIVE DATA 2023:', JSON.stringify(value))),
  // )

  ngOnInit(): void {
    this.custView = this.custeditService.pipe(map(value => process(value,this.gridState)),
   // tap(value => console.log('this sample data: ', JSON.stringify(value)))
    );
   this.custeditService.basaCustomer();
  }

  public onStateChange(state: State) {
   this.gridState = state;
   this.custeditService.basaCustomer();
  }

  addHandler(event) {
    this.custDataItem = new Customer();
    this.isNew = true;
  }


  editHandler({ dataItem }) {
    // this.editDataItem = dataItem;
    this.custDataItem = dataItem;
    this.isNew = false;
  }

  cancelHandler() {
    this.custDataItem = undefined;
  }

  saveHandler(customer: ICustomer) {
    this.custeditService.savedata(customer, this.isNew);

    this.custDataItem = undefined;
  }

  removeHandler({ dataItem }) {
    this.custeditService.remove(dataItem);
  }

  //*** CUSTOMER DATA */
  // allCustomers$ = this.editService.$.pipe(
  //   // tap((data) => console.log('getProducts 2022: ', JSON.stringify(data))),
  //   catchError((error) => {
  //     this.errorMessage = error;
  //     return EMPTY;
  //   })
  // );

}
