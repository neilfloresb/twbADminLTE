import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { mapapi } from '../shared/iUrlpath';
import { ICustomer } from '../shared/model/customer';
import { Artist } from '../shared/model/artist';
import { Terms } from '../shared/model/terms';

const customerData = mapapi.CustomerData;
const _customersa = mapapi.CustomerSAData;
const _customerDataList = mapapi.CustomerList;
const _customerDataANS = mapapi.customerAPIans;
const _artistData = mapapi.ArtistAPI;
const _terms_ = mapapi.TermsTableData;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  public _cusDATAans = _customerDataANS;
  private mcustomer$ = new BehaviorSubject<ICustomer[]>([]);
  private _customer: Observable<ICustomer[]>;
  private _customerData = customerData;

  constructor(private _http: HttpClient) { }

  /**  SERVICE EXAMPLE should BE from JESSE SANDERS */
  get customersJesse$(): Observable<ICustomer[]> {
    return this.mcustomer$.asObservable();
  }
  public loadAll() {
    this._http.get<ICustomer[]>(this._customerData)
      .subscribe(customers => this.mcustomer$.next(customers));
  }
  /** END OF JESSE SANDERS */

  public get customers() {
    if (!this._customer) {
      this._customer = this.getCustomers().pipe(shareReplay(1));
    }
    return this._customer;
  }

  getCustomers(): Observable<ICustomer[]> {
    return this._http
      .get<ICustomer[]>(this._customerData)
      .pipe(map((response) => response));
    // debugger;
  }

  //** FOR TWINBEE */
  getCustomerForListing(): Observable<ICustomer[]> {
    const _customerListData = `${_customerDataList}`;
    return this._http.get<ICustomer[]>(_customerListData)
      .pipe(catchError(this.handleError));
  }

  //** FOR ANS */
  getCustomerForListingforANS(): Observable<ICustomer[]> {
    const _customerListDataANS = `${_customerDataANS}`;
    return this._http.get<ICustomer[]>(_customerListDataANS)
      .pipe(catchError(this.handleError));
  }

  // *** GET customer using RXJS
  customerdata2022$ = this._http.get<ICustomer[]>(_customersa)
    .pipe(
      //  tap(value => console.log('customer', JSON.stringify(value))),
      catchError(this.handleError),
      shareReplay(1)
    );
  /// *** END OF RXJS

  getCustomerById(_custid: number): Observable<ICustomer> {
    const _customerListData = `${_customerDataList}/${_custid}`;
    return this._http.get<ICustomer>(_customerListData)
      .pipe(catchError(this.handleError));
  }

  InsertCustomer(_value: ICustomer): Observable<ICustomer> {
    const _customersa_ = `${_customersa}`;
    return this._http.post<ICustomer>(_customersa_, _value)
      .pipe(catchError(this.handleError));
  }

  UpdateCustomer(changes: ICustomer): Observable<ICustomer> {
    const _customersa_ = `${_customersa}`;
    return this._http.put<ICustomer>(_customersa + `/` + changes.custid, changes)
      .pipe(catchError(this.handleError));
  }

  deleteCustomer(custID: number | string) {
    const _customersa_ = `${_customersa}`;
    return this._http.delete(_customersa_ + `/` + custID);
  }
  UpdateCustomerOld(custid: number | string, changes: Partial<ICustomer>): Observable<ICustomer> {
    const _customersa_ = `${_customersa}`;
    return this._http.put<ICustomer>(_customersa + `/` + custid, changes)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error: ', errorResponse.error.message);
    } else {
      console.error('Server Side Error: ', errorResponse);
    }

    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }

  /*** FOR ANS * and for Quoation */
  getARTISTlisting(branchname: string): Observable<Artist[]> {
    const _artist_ = `${_artistData}/${branchname}`;
    return this._http.get<Artist[]>(_artist_)
      .pipe(catchError(this.handleError));
  }

  getTermsListing(): Observable<Terms[]> {
    const _terms = `${_terms_}`;
    return this._http.get<Terms[]>(_terms)
      .pipe(catchError(this.handleError));
  }


  // *** GET TERMS using RXJS
  terms$ = this._http.get<Terms[]>(_terms_)
    .pipe(
      //  tap(value => console.log('customer', JSON.stringify(value))),
      catchError(this.handleError),
      shareReplay(1)
    );
  //** END OF SCRIPT */
  
  /** IG-grid-TRANSACTION  for quotation details*/
  CustomerTransactionCrud(transactions): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return Observable.create((observer: Observer<any>) => {
      this._http.post(this._cusDATAans, transactions, httpOptions).subscribe(
        (res) => {
          observer.next(res);
          observer.complete();
        },
        (err) => {
          observer.error(err),
            console.log(err)
        }
      );
    });
  }
  /** END of IG-GRID-TRANSACTION */

  /** ERROR HANDLING */
  // private handleError(err: any): Observable<never> {
  //   // in a real world app, we may send the server to some remote logging infrastructure
  //   // instead of just logging it to the console
  //   let errorMessage: string;
  //   if (err.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     errorMessage = `An error occurred: ${err.error.message}`;
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
  //   }
  //   console.error(err);
  //   return throwError(errorMessage);
  // }
}
