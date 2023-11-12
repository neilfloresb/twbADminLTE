import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap, shareReplay } from 'rxjs/operators';
import { mapapi } from '../shared/iUrlpath';
import { IPaymentHdr, StatusCode } from '../shared/model/payment';
import { BankName } from '../shared/model/terms';
import { CustomerService } from './customer.service';


const tmpbranch = JSON.parse(localStorage.getItem('BranchName'));
const tmpEntity = JSON.parse(localStorage.getItem('entity'));

const bankName = mapapi.bankName;
const _seriesNo = mapapi.quotationSeriesNo;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public _tmpBranch = tmpbranch;
  public _tmpEntity = tmpEntity;
  public _tmpBankName = bankName;

  public doctype = [
    { type: 'OR', name: 'Official Receipt' },
    { type: 'CR', name: 'Collection Receipt' },
    { type: 'PR', name: 'Provisional Receipt' },
  ]

  public paytype = [
    { type: 'CS', name: 'CASH' },
    { type: 'CK', name: 'CHEQUE' },
    { type: 'OL', name: 'ONLINE' },
  ]

  constructor(private customerService: CustomerService, private _http: HttpClient) { }

  //** GET BILLing CONTROL NO. */
  getSeriesNO(codeID:string) {
    const _seriesno = `${_seriesNo}`;
    return this._http.get(_seriesno + '/' + codeID);
  };

  bankname$ = this._http.get<BankName[]>(this._tmpBankName)
    .pipe(
      //  tap(value => console.log('customer', JSON.stringify(value))),
      catchError(this.handleError),
      shareReplay(1)
    );

  customer$ = this.customerService.customerdata2022$.pipe(
    map(value => value.filter(value => value.entity === this._tmpEntity)),
    tap(value => console.log('Customer Datas', JSON.stringify(value))),
    catchError(this.handleError)
  );

  //** SAVING BILL HEADER */


  // Action Stream for adding/updating/deleting products
  private paymentHdrModifiedSubject = new Subject<IPaymentHdr>();
  billHdrModifiedAction$ = this.paymentHdrModifiedSubject.asObservable();

  addPaymentHdr(paymentHdr: IPaymentHdr) {
    // this.billHdrInsertedSubject.next(billheader);
    paymentHdr.status = StatusCode.Added;
    this.paymentHdrModifiedSubject.next(paymentHdr);
    //this._router.navigate(['/home/billing/create', billheader.billno])
  };

//** END of SAVING SCRIPT */


  private handleError(err: any): Observable<never> {
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
