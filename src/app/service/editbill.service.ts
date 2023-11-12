import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IBillDtl } from '../shared/model/billing';
import { mapapi } from '../shared/iUrlpath';


const _billDtlCon = mapapi.billingConDtl;

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable({
  providedIn: 'root'
})
export class EditbillService extends BehaviorSubject<any[]> {
  constructor(private http: HttpClient) {
    super([]);
  }

  private _billDtlData = _billDtlCon;
  private dataBillDtl: any[] = [];

  public saveBillDetail(val: number, data: any, isNew?: boolean) {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();
    //this.saveCustomer(data);
    // this.savekuno(action,data);
    this.getBillDETAILS(val, action, data).subscribe(
      () => this.ReadBillDetails(val),
      //   () => this.basaCustomer()
    );
  };

  public remove(val: number, data: any){
  //  const action = isNew ? CREATE_ACTION : UPDATE_ACTION;
    this.reset();

    this.getBillDETAILS(val, REMOVE_ACTION, data).subscribe(
      () => this.ReadBillDetails(val),
      //   () => this.basaCustomer()
    );
  }

  private reset() {
    this.dataBillDtl = [];
  }

  public ReadBillDetails(val: number) {
    if (this.dataBillDtl.length) {
      return super.next(this.dataBillDtl);
    }
    this.getBillDETAILS(val)
      .pipe(
        tap((data) => {
          this.dataBillDtl = data;
        })
      )
      .subscribe((data) => {
        super.next(data);
      });
  };

  private getBillDETAILS(billno: number, action: string = '', dataBilldtl?: any): Observable<IBillDtl[]> {
    return this.http.get<IBillDtl[]>(this._billDtlData + `/${billno}`).pipe(
      map((res: any) => {
        console.log('BILL DETAILS:' + JSON.stringify(res));
        return res;
      })
    );
  };


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
