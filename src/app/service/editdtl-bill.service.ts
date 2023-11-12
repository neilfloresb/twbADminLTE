import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { billinDETAIL, IviewDrdDetail } from '../shared/model/billing';
import { mapapi } from '../shared/iUrlpath';


const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const _billDtlCon = mapapi.billingConDtl;

@Injectable({
  providedIn: 'root'
})
export class EditdtlBIllService extends BehaviorSubject<any[]> {

  constructor(private http: HttpClient) {
    super([]);
  }

  private _billDtlData = _billDtlCon;
  private dataBillDtlNo: any[] = [];

  public ReadBillDtlNo(val: string) {
    if (this.dataBillDtlNo.length) {
      return super.next(this.dataBillDtlNo);
    }
    this.getBillDtlNo(val)
      .pipe(
        tap((data) => {
          this.dataBillDtlNo = data;
        })
      )
      .subscribe((data) => {
        super.next(data);
      });
  }

  public savedata(data: any, isNew?: boolean,id?: string) {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

   // this.reset();
    //this.saveCustomer(data);
    // this.savekuno(action,data);
    this.getBillDtlNo(id, action).subscribe(
      () => this.ReadBillDtlNo(id),
      //   () => this.basaCustomer()
    );
  };

  private getBillDtlNo(billDtlNo: string, action: string = '', dataCustomer?: any): Observable<IviewDrdDetail[]> {
    return this.http.get<IviewDrdDetail[]>(this._billDtlData + `/${billDtlNo}`).pipe(
      // map((res) =>
      //   res.map(
      //     (billdtl) =>
      //     ({
      //       ...billdtl,
      //       amtFor: billdtl.qtydr * billdtl.unitcost,
      //     } as IviewDrdDetail),
      //     console.log('BILLING DETAILS' + JSON.stringify(res))
      //   ),

      // )
      map((res: any) => {
        console.log('bill details: ' + JSON.stringify(res));
        return res;
      })
    );
  }

  // private getBillDtlNo(billDtlNo: string, action: string = '', dataCustomer?: any): Observable<IviewDrdDetail[]> {
  //   return this.http.get<IviewDrdDetail>(this._billDtlData + `/${billDtlNo}`).pipe(
  //     map((res: any) => {
  //       console.log('tes for customer' + JSON.stringify(res));
  //       return res;
  //     })
  //   );
  // }


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
