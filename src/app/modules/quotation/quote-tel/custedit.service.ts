import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Observer, throwError } from 'rxjs';
import {
  map,
  tap,
  catchError,
  shareReplay,
  filter,
  switchMap,
} from 'rxjs/operators';
import { Customer, ICustomer } from './icustomer';
import { QuoteService } from 'src/app/service/quote.service';
import { IQuotation } from 'src/app/shared/model/quotation';
import { AnyFn } from '@ngrx/store/src/selector';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const apiUrl = 'http://localhost:50384/api/customersa';
const apiUrl2 = 'http://localhost:50384/api/Customer2022/';
//const apiUrl = 'http://twinbeeprintads.com:8186/api/customersa';
//const apiUrl = 'http://twinbeeprintads.com:2023/api/customersa';

@Injectable({
  providedIn: 'root'
})

// @Injectable()
export class CusteditService extends BehaviorSubject<any[]> {
  constructor(private http: HttpClient) {
    super([]);
  }

  private _customerData = apiUrl;

  private dataCustomer: any[] = [];

  // // To support a refresh feature
  // private refresh = new BehaviorSubject<boolean>(true);
  // *** CUSTOMER LINES

  public savedata(data: any, isNew?: boolean) {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();
    //this.saveCustomer(data);
   // this.savekuno(action,data);
    this.getCustomers(action, data).subscribe(
      () => this.basaCustomer(),
   //   () => this.basaCustomer()
    );
  };

  // saveCustomer(_value: Customer): Observable<Customer> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   };
  //   const _customersa_ = `${apiUrl2}/`;
  //   let custValue = [{ cust: 0, custname: 'SAMPLE2022', cperson: "sample 2022" }]
  //   return this.http.post<Customer>(_customersa_, custValue, httpOptions)
  //     .pipe(
  //       tap(data => console.log('Created customer', JSON.stringify(data))),
  //       catchError(this.handleError));
  // };

  public remove(data: any) {
    this.reset();

    this.getCustomers(REMOVE_ACTION, data).subscribe(
      () => this.basaCustomer(),
      //() => this.basaCustomer()
    );
  }

  public resetItem(dataItem: any) {
    if (!dataItem) {
      return;
    }

    // find orignal data item
    const originalDataItem = this.dataCustomer.find(
      (item) => item.custid === dataItem.custid
    );

    // revert changes
    Object.assign(originalDataItem, dataItem);

    super.next(this.dataCustomer);
  }

  private reset() {
    this.dataCustomer = [];
  }

  public basaCustomer() {
    if (this.dataCustomer.length) {
      return super.next(this.dataCustomer);
    }
    this.getCustomers()
      .pipe(
        tap((data) => {
          this.dataCustomer = data;
        })
      )
      .subscribe((data) => {
        super.next(data);
      });
  }

  // private getCustomers2(action: string = '', dataCustomer?: any): Observable<any[]> {
  //   return this.http
  //     .jsonp(this._customerData, 'callback')
  //     .pipe(map(res => <any[]>res));
  // }

  private getCustomers(action: string = '', dataCustomer?: any): Observable<ICustomer[]> {
    return this.http.get<ICustomer>(this._customerData).pipe(
      map((res: any) => {
        //console.log('tes for customer' + JSON.stringify(res));
        return res;
      })
    );
  }


  customers$ = this.http.get<ICustomer[]>(this._customerData).pipe(
    // tap(data => console.log('DECLARATIVE DATA 2022:', JSON.stringify(data))),
    shareReplay(1),
    catchError(this.handleError)
  );

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
