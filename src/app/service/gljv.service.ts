import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { mapapi } from '../shared/iUrlpath';
import { IGLJVdetails, IGLJVheader } from '../shared/model/glJVHeader';

const _GLJVCrudHeader = mapapi.GLJVCrudHeader;
const _gljvHeader = mapapi.jvGLHeader;
const _gljvDetails = mapapi.GLjvDetails;
const _gljvCRUDdetails = mapapi.gljv_detailsCRUD;
@Injectable({
  providedIn: 'root'
})
export class GljvService {

  public _jvglCRUDdetails = _gljvCRUDdetails;
  constructor(private _http: HttpClient) { }

  gljvForm: IGLJVheader;

  getglJVHeader(): Observable<IGLJVheader[]> {
    const _gljvHedader_ = `${_gljvHeader}`;
    return this._http.get<IGLJVheader[]>(_gljvHedader_)
      .pipe(catchError(this.handleError));
  }

  InsertJVHeader(_value: IGLJVheader): Observable<IGLJVheader> {
    const _glJVHeader_ = `${_gljvHeader}/`;
    return this._http.post<IGLJVheader>(_glJVHeader_, _value)
    //    .pipe(catchError(this.handleError));
  }

  UpdateJVHeader(_value: IGLJVheader): Observable<IGLJVheader> {
    const _glJVHeader_ = `${_gljvHeader}/${_value.ref_no}/`;
    return this._http.put<IGLJVheader>(_glJVHeader_, _value)
    //    .pipe(catchError(this.handleError));
  }

  deleteJVHeader(ref_no: number | string) {
    const _glJVHeader_ = `${_gljvHeader}`;
    return this._http.delete(_glJVHeader_ + `/` + ref_no);
  }

  /** JV DEtails  */
  getglJVDetails(ref_no: string): Observable<IGLJVdetails[]> {
    const _gljvDetails_ = `${_gljvDetails}/${ref_no}`;
    return this._http.get<IGLJVdetails[]>(_gljvDetails_)
      .pipe(catchError(this.handleError));
  }

  /** IG-grid-TRANSACTION */
  jvglCRUDdetails(transactions): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return Observable.create((observer: Observer<any>) => {
      this._http.post(this._jvglCRUDdetails, transactions, httpOptions).subscribe(
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
