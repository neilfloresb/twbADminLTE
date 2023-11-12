import { Component, Inject, OnInit } from '@angular/core';
import { EditService } from '../quote-tel/edit.service';
import { State, process } from '@progress/kendo-data-query';
import { EMPTY, Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../quote-tel/Product';
import { CusteditService } from './custedit.service';
//import { ICustomer } from 'src/app/shared/model/customer';
import { Customer, ICustomer } from './icustomer';

@Component({
  selector: 'app-quote-tel',
  templateUrl: './quote-tel.component.html',
  styleUrls: ['./quote-tel.component.scss']
})
export class QuoteTelComponent implements OnInit {
  errorMessage = '';

  public custView: Observable<GridDataResult>;

  public view2: Observable<GridDataResult>;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  public editDataItem: Product;
  public custDataItem: Customer;
  public isNew: boolean;
  private editService: EditService;
  private custeditService: CusteditService;

  constructor(@Inject(EditService) editServiceFactory: any) {
    this.editService = editServiceFactory();

  }

  // constructor(@Inject(EditService) editServiceFactory: any, @Inject(CusteditService) custeditServiceFactory: any) {
  //   this.editService = editServiceFactory();
  //   this.custeditService = custeditServiceFactory();
  // }


  ngOnInit(): void {
    // this.view = this.editService.pipe(map(data => process(data, this.gridState)));



    // this.custView = this.custeditService.pipe(map(value => process(value, this.gridState)),
    //   tap(value => console.log('this sample data: ', JSON.stringify(value))));
    // this.custeditService.basaCustomer();

    this.view2 = this.editService.pipe(map(data => process(data, this.gridState)),
      tap(data => console.log('this view2: ', JSON.stringify(data))));
    this.editService.read();

  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.editService.read();

   /// this.custeditService.basaCustomer();
  }

  addHandler(event) {
    this.editDataItem = new Product();
    this.isNew = true;
  }

  editHandler({ dataItem }) {
   this.editDataItem = dataItem;

    this.isNew = false;
  }

  // editHandler2({ dataItem }) {
  //   // this.editDataItem = dataItem;
  //   this.custDataItem = dataItem;
  //   this.isNew = false;
  // }

  cancelHandler() {
    this.editDataItem = undefined;
  }

  saveHandler(product: Product) {
    this.editService.save(product, this.isNew);

    this.editDataItem = undefined;
  }
  // saveHandler2(customer: ICustomer) {
  //   this.custeditService.savedata(customer, this.isNew);

  //   this.custDataItem = undefined;
  // }

  removeHandler({ dataItem }) {
    this.editService.remove(dataItem);
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
