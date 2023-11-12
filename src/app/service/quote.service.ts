import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { mapapi } from '../shared/iUrlpath';
import { IConfirmQuotation, IQuotation, IQuoteDTL } from '../shared/model/quotation';
import { JobOrder, JobOrderList } from '../shared/model/joborder';
import { Customer } from '../modules/quotation/quote-tel/icustomer';
import { ICustomer } from '../shared/model/customer';

const _quoteseries = mapapi.quotationSeriesNo;
const ansquote = mapapi.ansquotationhdr;
const _andQuoteViewHdr = mapapi.ansquotationVIEWhdr;
const _quoteJsonDtl_ = mapapi.quotationDtlJSONresult;
const _QuoteDtlCrudTRAN = mapapi.quoteDTlsCrudTRAN;
const _CONFIRMquotation = mapapi.conFirmQuotion;
const _joborder = mapapi.forJobOrder;
const _joList = mapapi.JobOrderList;
const _quoteCopy = mapapi.QuotationCopy;

const apiUrl = 'http://localhost:50384/api/customersa';
const apiUrl2 = 'http://localhost:50384/api/Customer2022';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  public _quoteDtlCrudtran = _QuoteDtlCrudTRAN
  quoteForm: IQuotation;
  form_confirm: IConfirmQuotation;
  constructor(private _http: HttpClient) { }


  // getGLAcctBycode(acct_code: string): Observable<JVaccts[]> {
  //   const _glAccountsData = `${_gl_accounts}/${acct_code}`;
  //   return this._http.get<JVaccts[]>(_glAccountsData)
  //     .pipe(catchError(this.handleError));
  // }

  getQUATATIONhdr(branchname: string, userid: string): Observable<IQuotation[]> {
    const _QuoteViewHdr_ = `${_andQuoteViewHdr}/${branchname}/${userid}`;
    return this._http.get<IQuotation[]>(_QuoteViewHdr_)
      .pipe(catchError(this.handleError));
  }

  getQuotataionSeriesno() {
    const _sqnoseries = `${_quoteseries}`;
    return this._http.get(_sqnoseries + '/QUOTATION');
  }

  getJobOrderSeriesno() {
    const _sqnoseries = `${_quoteseries}`;
    return this._http.get(_sqnoseries + '/JO');
  }

  getQuotationByNO(sqno: string): Observable<IQuotation[]> {
    const _QuoteByNo_ = `${ansquote}/${sqno}`;
    return this._http.get<IQuotation[]>(_QuoteByNo_)
      .pipe(catchError(this.handleError));
  }

  CreateQuoteHeader(_value: IQuotation): Observable<void> {
    const _QUOTEVHeader_ = `${ansquote}/`;
    return this._http.post<void>(_QUOTEVHeader_, _value)
      .pipe(
        tap(data => console.log('Created Quotation', JSON.stringify(data))),
        catchError(this.handleError));
  }

  UpdateQuoteHeader(_value: IQuotation): Observable<void> {
    const _QUOTEVHeader_ = `${ansquote}/`;
    return this._http.put<void>(_QUOTEVHeader_, _value)
      .pipe(
        tap(data => console.log('Updated Quotation', JSON.stringify(data))),
        catchError(this.handleError));
  }

  /// SAMPLE FOR CUSTOMER SAVING
  saveCustomer(_value: ICustomer): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const _customersa_ = `${apiUrl}/`;
    return this._http.post<void>(_customersa_, _value, httpOptions)
      .pipe(
        tap(data => console.log('Created customer', JSON.stringify(data))),
        catchError(this.handleError));
  }

  saveUpdateCustomer(_value: ICustomer): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const _customersa_ = `${apiUrl}/${_value.custid}`;
    return this._http.put<void>(_customersa_, _value, httpOptions)
      .pipe(
        tap(data => console.log('Created customer', JSON.stringify(data))),
        catchError(this.handleError));
  }
  /// END OF SAMPLE CUSTOMER SAVING

  ConfirmQuotation(_value: any): Observable<void> {
    const _confirm_ = `${_CONFIRMquotation}/`;
    return this._http.put<void>(_confirm_, _value)
      .pipe(catchError(this.handleError));
  }

  QuotationCopy(_value: any): Observable<void> {
    const quoteCopy = `${_quoteCopy}/${_value}`;
    return this._http.put<void>(quoteCopy, _value)
      .pipe(catchError(this.handleError));
  }


  /** QUOTATION DETAILS */
  getQuotationDetailByNO(sqno: string): Observable<IQuoteDTL[]> {
    const _QuoteDtlByNo_ = `${_quoteJsonDtl_}/${sqno}`;
    return this._http.get<IQuoteDTL[]>(_QuoteDtlByNo_)
      .pipe(catchError(this.handleError));
  }

  getQuoteDetailsbySqnoforJO(sqno: string): Observable<IQuoteDTL[]> {
    const _getforjo_ = `${_joborder}/${sqno}`;
    return this._http.get<IQuoteDTL[]>(_getforjo_)
      .pipe(catchError(this.handleError));
  }

  GenerateJobOrder(_value: JobOrder): Observable<void> {
    const _genJO = `${_joborder}/`;
    return this._http.post<void>(_genJO, _value)
      .pipe(catchError(this.handleError));
  }

  JobOrderList(sqno: string): Observable<JobOrderList[]> {
    const _JOforprintList = `${_joList}/${sqno}`;
    return this._http.get<JobOrderList[]>(_JOforprintList)
      .pipe(catchError(this.handleError));
  }

  /** IG-grid-TRANSACTION  for quotation details*/
  QuoteDtlsCRUD(transactions): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return Observable.create((observer: Observer<any>) => {
      this._http.post(this._quoteDtlCrudtran, transactions, httpOptions).subscribe(
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

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error: ', errorResponse.error.message);
    } else {
      console.error('Server Side Error: ', errorResponse);
    }

    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }

}
