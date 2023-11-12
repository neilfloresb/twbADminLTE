import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { mapapi } from '../shared/iUrlpath';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { glControNO, IGLacconts, JVaccts } from '../shared/model/acctgaccounts';
import { catchError } from 'rxjs/operators';

const _gl_accounts = mapapi.glaccounts;
const _gl_controlNo = mapapi.getControlnoSeries;
@Injectable({
  providedIn: 'root'
})
export class AcctgaccountsService {

  constructor(private _http: HttpClient) { }

  getGLAccounts(): Observable<IGLacconts[]> {
    const _glAccountsData = `${_gl_accounts}`;
    return this._http.get<IGLacconts[]>(_glAccountsData)
      .pipe(catchError(this.handleError));
  }

  JVAccounts(): Observable<JVaccts[]> {
    const _glAccountsData = `${_gl_accounts}`;
    return this._http.get<JVaccts[]>(_glAccountsData)
      .pipe(catchError(this.handleError));
  }

  getGLAcctBycode(acct_code: string): Observable<JVaccts[]> {
    const _glAccountsData = `${_gl_accounts}/${acct_code}`;
    return this._http.get<JVaccts[]>(_glAccountsData)
      .pipe(catchError(this.handleError));
  }

  getGLCONTROLNO(book_code: string): Observable<glControNO[]> {
    const _glCONTROL = `${_gl_controlNo}/${book_code}`;
    return this._http.get<glControNO[]>(_glCONTROL)
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
}
