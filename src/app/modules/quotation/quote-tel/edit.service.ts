import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { tap, map, shareReplay, catchError } from 'rxjs/operators';
import { ICustomer } from 'src/app/shared/model/customer';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const apiUrl = 'http://192.168.1.70:50384/api/customersa';

@Injectable()
export class EditService extends BehaviorSubject<any[]> {
  constructor(private http: HttpClient) {
    super([]);
  }
  private _customerData = apiUrl;

  private data: any[] = [];

  private dataCustomer: any[]=[];

  public read() {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch()
      .pipe(
        tap(data => {
          this.data = data;
        })
      )
      .subscribe(data => {
        super.next(data);
      });
  }

  public save(data: any, isNew?: boolean) {
    const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

    this.reset();

    this.fetch(action, data)
      .subscribe(() => this.read(), () => this.read());
  }

  public remove(data: any) {
    this.reset();

    this.fetch(REMOVE_ACTION, data)
      .subscribe(() => this.read(), () => this.read());
  }

  public resetItem(dataItem: any) {
    if (!dataItem) { return; }

    // find orignal data item
    const originalDataItem = this.data.find(item => item.ProductID === dataItem.ProductID);

    // revert changes
    Object.assign(originalDataItem, dataItem);
    super.next(this.data);
  }

  private reset() {
    this.data = [];
  }

  private fetch(action: string = '', data?: any): Observable<any[]> {
    return this.http
      .jsonp(`https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(data)}`, 'callback')
      .pipe(map(res => <any[]>res));
  }

  private serializeModels(data?: any): string {
    return data ? `&models=${JSON.stringify([data])}` : '';
  }


  // *** CUSTOMER LINES

  public basaCustomer() {
    if (this.dataCustomer.length) {
      return super.next(this.dataCustomer);
    }
    this.getCustomers()
      .pipe(
        tap(data => {
          this.dataCustomer = data;
        })
      )
      .subscribe(data => {
        super.next(data);
      });
  }


  // private getCustomers2(action: string = '', dataCustomer?: any): Observable<any[]> {
  //   return this.http
  //     .jsonp(this._customerData,'callback')
  //     .pipe(map(res => <any[]>res));
  // }

  private getCustomers(action: string = '', dataCustomer?: any): Observable<ICustomer[]> {
    return this.http.get<ICustomer>(this._customerData)
      .pipe(map((res: any) => {
        console.log('tes for customer' + JSON.stringify(res));
        return res;
      }))
  }

  private kuhaData(action: string = '', dataCustomer?: any): Observable<any[]> {
    return this.http.get<ICustomer[]>(this._customerData)
  }



  customers$ = this.http.get<ICustomer[]>(this._customerData)
    .pipe(
      //tap(data => console.log('DECLARATIVE DATA 2022:', JSON.stringify(data))),
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
