import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, from, merge, Observable, pipe, Subject, throwError } from 'rxjs';
import { catchError, map, mergeMap, shareReplay, switchMap, tap, filter, toArray, concatMap, scan } from 'rxjs/operators';
import { mapapi } from '../shared/iUrlpath';
import { CustomerService } from './customer.service';
import { BillHeaderPost, billinDETAIL, IBillDtl, IBillHeader, iBillPost, IDrdBillDtl, StatusCode } from '../shared/model/billing';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import { jsbn } from 'node-forge';
import { UserService } from './user.service';



const bilconDtl = mapapi.billingConDtl;
const bilconHdr = mapapi.billingConHeader;
const billconBillDrd = mapapi.billingConBillDrdDetail;
const _quoteseries = mapapi.quotationSeriesNo;


const tmpbranch = JSON.parse(localStorage.getItem('BranchName'));
const tmpEntity = JSON.parse(localStorage.getItem('entity'));

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private condtlbill = bilconDtl;
  private conHdrbill = bilconHdr;
  private conDrdBillDtl = billconBillDrd;
  public _tmpBranch = tmpbranch;
  public _tmpEntity = tmpEntity;
  private tmpBranchName: string = this.userService.currentBranch;
  private tmpCurrentUser: string = this.userService.currentUser;
  private tmpCurrentEntity: string = this.userService.currentEntity;


  //private  this.productSelectedSubject.next(selectedProductId);
  private billDtlSelectedSubject = new BehaviorSubject<number>(0);
  billDtlSelectedAction$ = this.billDtlSelectedSubject.asObservable();

  private addBillDtlSubject = new Subject<IBillDtl>();
  addBillDetailAction$ = this.addBillDtlSubject.asObservable();

  private custidSelSubject = new BehaviorSubject<number>(0);
  custidSelectedAction$ = this.custidSelSubject.asObservable();

  private branchNameSelSubject = new BehaviorSubject<string>('');
  branchNameSelectedAction$ = this.branchNameSelSubject.asObservable();

  private billHdrInsertedSubject = new Subject<IBillHeader>();
  billHdrInsertedAction$ = this.billHdrInsertedSubject.asObservable();

  private entitySubject = new Subject<string>();
  entityAction$ = this.entitySubject.asObservable();

  // To SUPPORT A refresh feature
  private refresh = new BehaviorSubject<Boolean>(true);

  constructor(private customerService: CustomerService, private _http: HttpClient, private _router: Router, private userService: UserService) { }


  //** CLASSIC RELATED Data Pattern */
  GetBillHdrNO(billno: number): Observable<IBillHeader[]> {
    const BillByNo = `${bilconHdr}/${billno}`;
    return this._http.get<IBillHeader[]>(BillByNo)
      .pipe(catchError(this.handleError));
  }
  //** **//

  //** view customer and get */
  // customer$ = this.customerService.customerdata2022$.pipe(


  customer$ = this.customerService.customerdata2022$.pipe(
    map(value => value.filter(value => value.entity === this._tmpEntity)),
    tap(value => console.log('Customer Datas', JSON.stringify(value))),
    catchError(this.handleError)
  );

  // viewCustomer$ = this.customer$.pipe(
  //   map(value => value),
  //   //  tap(value => console.log('customerdata', JSON.stringify(value))),
  // );
  //** end of script */

  //*** MAIN script to Get the Web API */
  drdBillDtl$ = this._http.get<IDrdBillDtl[]>(this.conDrdBillDtl)
    .pipe(
      catchError(this.handleError)
    );

  billingDetail$ = this._http.get<IBillDtl[]>(this.condtlbill)
    .pipe(
      // tap(value => console.log('', JSON.stringify(value))),
      catchError(this.handleError)
    );

  billHeader$ = this._http.get<IBillHeader[]>(this.conHdrbill)
    .pipe(
      //   tap(value => console.log('Data from Header', JSON.stringify(value))),
      catchError(this.handleError),
      shareReplay(1)
    );


  //** REFRESH DATA */

  refreshData(): void {
    this.start();
  }

  start() {
    this.refresh.next(true);
  }

  billHeaderListing$ = this.refresh
    .pipe(
      mergeMap(() => this._http.get<IBillHeader[]>(this.conHdrbill)
        .pipe(
          //      tap(data => console.log('Bill Header from Refresh', JSON.stringify(data))),
          catchError(this.handleError)
        ))
    );

  billSelectedRefresh$ = this.refresh
    .pipe(
      mergeMap(() => this.SelectedBillHdr$
        .pipe(
          //       tap(data => console.log('try hdr refresh', JSON.stringify(data))),
          catchError(this.handleError)
        )
      ),
    );

  //** GET BILLing CONTROL NO. */
  getBillSeriesno() {
    const _sqnoseries = `${_quoteseries}`;
    return this._http.get(_sqnoseries + '/BILL');
  };
  // ** end of script //

  //**GET SELECTED DRD LISTING for BILLING*/

  dRDlistforBill$ = (this.custidSelectedAction$)
    .pipe(
      switchMap((custIdSelected) =>
        this._http.get<IDrdBillDtl[]>(`${this.conDrdBillDtl}/${custIdSelected}/${this._tmpBranch}`)
          .pipe(
            map((value) =>
              value.map(
                (dr) =>
                ({
                  ...dr,
                  amtfor: dr.qty * dr.unitcost
                } as IDrdBillDtl)
              )
            ),
            //     tap(value => console.log('for drd:', JSON.stringify(value))),
            shareReplay(1),
            catchError(this.handleError)
          )
      ),
      // map(value => ({ amtfor: value.qtydr * value.unitcost }) as IDrdBillDtl),
      // tap(value => console.log('for drd:', JSON.stringify(value))),
    );
  // dRDlistforBill$ = this.custidSelectedAction$
  //   .pipe(
  //     switchMap((custIdSelected) =>
  //       this._http.get<IDrdBillDtl>(`${this.conDrdBillDtl}/${custIdSelected}/${this._tmpBranch}`)
  //         .pipe(
  //           map(value => ({amtfor: value.qtydr * value.unitcost }) as IDrdBillDtl) ,
  //           tap(value => console.log('for drd:', JSON.stringify(value))),
  //           //  map(b => ({ ...b }) as IBillHeader),
  //           catchError(this.handleError)
  //         ))
  //   )

  //** SAVING BILL HEADER */


  // Action Stream for adding/updating/deleting products
  private billHdrModifiedSubject = new Subject<IBillHeader>();
  billHdrModifiedAction$ = this.billHdrModifiedSubject.asObservable();

  addBillHdr(billheader: IBillHeader) {
   // this.billHdrInsertedSubject.next(billheader);
    billheader.status = StatusCode.Added;
    this.billHdrModifiedSubject.next(billheader);
    //this._router.navigate(['/home/billing/create', billheader.billno])
  };

  //INSERT BILLing HEADER

  // cumulativeBillHdr$ = merge(this.billHeader$, this.billHdrInsertedAction$.pipe(
  //   concatMap((billHdr) => this._http.post<IBillHeader>(this.conHdrbill, billHdr)),

  //   catchError((err) => {
  //     console.error(err);
  //     return throwError(err)
  //   })
  // ),
  //   this.billHeader$
  // ).pipe(
  //   scan((acc: IBillHeader[], value: IBillHeader) => [...acc, value]),
  //   shareReplay(1)
  // );


  //** SAVING / UPDATE BILL HEADER */
  UpdateBillHdr(billheader: IBillHeader) {
    billheader.status = StatusCode.Updated;
    this.billHdrModifiedSubject.next(billheader);
  }

  billingWITHcrud$ = merge(this.billHeader$,
    this.billHdrModifiedAction$.pipe(
      concatMap(billHdr => this.saveBillHdr(billHdr))
    ))
    .pipe(
      //  scan((acc: IBillHeader[], value: IBillHeader) => [...acc, value]),
      scan((acc: IBillHeader[], value: IBillHeader) => this.modifyBillhdr(acc, value)),
      shareReplay(1)
    );

    
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",

    }), responseType: 'text' as 'json'
  };
  saveBillHdr(billhdr: IBillHeader): Observable<IBillHeader> {

    const _billno = billhdr.billno;
    if (billhdr.status === StatusCode.Added) {
      return this._http.post<IBillHeader>(this.conHdrbill, billhdr, this.httpOptions)
        .pipe(
          tap(data => console.log('Added Billing Header:', JSON.stringify(data))),
          tap(() => this._router.navigate(['/home/billing/create', _billno])),
          catchError((err) => {
            console.error(err);
            return throwError(err);
          })
        );
    }
    if (billhdr.status === StatusCode.Updated) {
      const url = `${this.conHdrbill}/${billhdr.billno}`;
      return this._http.put<IBillHeader>(url, billhdr, this.httpOptions)
        .pipe(
          tap(value => console.log('Updated Billing Header:' + JSON.stringify(value))),
          map(() => billhdr),
          catchError(this.handleError)
        )
    }
  }

  // Modify the Array of BillHeader
  modifyBillhdr(billheaders: IBillHeader[], billhdr: IBillHeader): IBillHeader[] {
    if (billhdr.status === StatusCode.Added) {
      return [...billheaders,
      { ...billhdr, status: StatusCode.Unchanged }
      ];
    }

    if (billhdr.status === StatusCode.Updated) {
      return billheaders.map(b => b.billno === billhdr.billno ?
        { ...billhdr, status: StatusCode.Unchanged } : b);
    }
  }

  //** Get Selected  Bill Header and FIND the current BILL NO. */
  SelectedBillHdr$ = combineLatest(this.billDtlSelectedAction$, this.billHeader$).pipe(
    map(([selectBillHdrId, billHdrs]) => billHdrs.find(billHdr => billHdr.billno === selectBillHdrId)
    ),
    tap(billHdrs => console.log('Bill Selected Header', billHdrs)),
  )

  //** GET SELECTED BILL HEADER  by branchName*/
  getBillHdrByBRANCH$ = this.billHeader$.pipe(
    // map(values => values.filter(values => values.branchname === this._tmpBranch)),
    map(values => values.filter(values => values.branchname === this._tmpBranch)),
    tap(values => console.log('bybranch', values)),
    catchError(this.handleError)
  );

  // getBillHdrByBRANCH$ = combineLatest(this.billHeader$, this.entityAction$).pipe(
  //   // map(values => values.filter(values => values.branchname === this._tmpBranch)),
  //   map(([values, selentity]) => values.filter(values => values.branchname === selentity)),
  //   tap(values => console.log('bybranch', values)),
  //   catchError(this.handleError)
  // );
  // //** Get Selected Version Using HIGH-ORDER MAPPING Operator */
  selectedbillHeader2$ = this.billDtlSelectedAction$
    .pipe(
      switchMap(selectedBillHdrId =>
        this._http.get<IBillHeader>(`${this.conHdrbill}/${selectedBillHdrId}`)
          .pipe(
            tap(value => console.log(JSON.stringify(value))),
            //  map(b => ({ ...b }) as IBillHeader),
            catchError(this.handleError)
          ))
    );
  /// Retrieve Related Data Pattern (one)
  billDetailOne$ = this.selectedbillHeader2$
    .pipe(
      switchMap(billhdr => this._http.get<IBillDtl>(`${this.condtlbill}/${billhdr.billno}`))
    );
  // end
  /// Retrieve Related Data Pattern (many*)
  /// Not the BEST immplementation
  billDetailnotBEST$ = this.selectedbillHeader2$
    .pipe(
      switchMap(billdtl => this._http.get<IBillDtl>(`${this.condtlbill}/${billdtl.billno}`))
    );
  /// Retrieve Related Data Pattern (many*)

  // billDetail2ndBEST$ = this.selectedbillHeader2$
  //   .pipe(
  //     switchMap(billhdr =>
  //       from(billhdr.billno)
  //         .pipe(
  //           mergeMap(billno =>
  //             this._http.get<IBillDtl>(`${this.condtlbill}/${billno}`)),
  //           toArray(),
  //           tap(value => console.log('data fromm to many', JSON.stringify(value))),
  //         )
  //     )
  //   )

  /// Retrieve Related Data Pattern (many*)   RECOMMENDED IMPLEMENTATION
  // billDetail$ = this.selectedbillHeader2$
  //   .pipe(
  //     switchMap(billhdr =>
  //       forkJoin(billhdr.billno.(billno =>
  //         this._http.get<IBillDtl>(`${this.condtlbill}/${billno}`)))
  //     )
  //   );
  //** end of script */





  //** get data billing detial */
  billingDetail2$ = this._http.get<IBillDtl[]>(this.condtlbill)
    .pipe(
      //filter(billdtl => string(selectedDtl)),
      //tap(value => console.log('first Data', JSON.stringify(value))),
      switchMap(billdtl => billdtl),
      tap(value => console.log('after merge1', JSON.stringify(value))),
      map(billdtl => ({
        billno: billdtl.billno,
        itemdesc: billdtl.itemdesc,
        unitprice: billdtl.unitprice,
        qty: billdtl.qty,
        amt: billdtl.unitprice * billdtl.qty
      }) as billinDETAIL),
      tap(value => console.log('after merge2', JSON.stringify(value))),
      shareReplay(1),
      catchError(this.handleError)
    );


  billingDetail4$ = this.billDtlSelectedAction$
    .pipe(
      switchMap(selectedBillDtl =>
        this._http.get<IBillDtl>(`${this.condtlbill}/${selectedBillDtl}`)
          .pipe(
            tap(value => console.log(JSON.stringify(value))),
            catchError(this.handleError)
          )),
      // map(billdtl => ({
      //   billno: billdtl.billno,
      //   itemdesc: billdtl.itemdesc,
      //   unitprice: billdtl.unitprice,
      //   qty: billdtl.qty,
      //   amt: billdtl.unitprice * billdtl.qty
      // }) as billinDETAIL),
      // tap(value => console.log('after merge 4', JSON.stringify(value))),
      shareReplay(1),
      // catchError(this.handleError)
    );

  billingDetail3$ = this._http.get<IBillDtl[]>(this.condtlbill + '/' + this.billDtlSelectedAction$)
    .pipe(
      //filter(billdtl => string(selectedDtl)),
      //tap(value => console.log('first Data', JSON.stringify(value))),
      mergeMap(billdtl => billdtl),
      tap(value => console.log('after merge', JSON.stringify(value))),
      map(billdtl => ({
        billno: billdtl.billno,
        itemdesc: billdtl.itemdesc,
        unitprice: billdtl.unitprice,
        qty: billdtl.qty,
        amt: billdtl.unitprice * billdtl.qty
      }) as billinDETAIL),
      shareReplay(1),
      catchError(this.handleError)
    );

  //** this code using WebApi get by IDs */
  // selectedBilDtl2$ = this.billDtlSelectedAction$
  //   .pipe(
  //     filter(id => !!id),
  //     switchMap(selectedBilDtl => this._http.get<IBillDtl[]>(this.condtlbill + `/${selectedBilDtl}`),
  //       map(billdtl => ({
  //       billno: billdtl.billno,
  //       itemdesc: billdtl.itemdesc,
  //       unitprice: billdtl.unitprice,
  //       qty: billdtl.qty,
  //       amt: billdtl.unitprice * billdtl.qty
  //     }) as billinDETAIL),
  //       shareReplay(1),
  //       map(billdtl => ({ amt: billdtl.qty }) as IBillDtl[]),
  //       tap(billdtl => console.log('', JSON.stringify(billdtl))),
  //       catchError(this.handleError)
  //     )

  // selectedBilDtl2$ = this.billDtlSelectedAction$
  //   .pipe(
  //     filter(id => !!id),
  //     switchMap(selectedBilDtl => this._http.get<billinDETAIL[]>(this.condtlbill + `/${selectedBilDtl}`)
  //       .pipe(
  //         map((value) => ({ ...value }) as billinDETAIL[], amt: value.qty * value.unitprice),
  //         tap(value => console.log('', JSON.stringify(value))),
  //         catchError(this.handleError)
  //       )
  //     )
  //   )

  //** get the Data from BillingDetail Variable to initials the amount*/
  billdtls$ = this.billingDetail$.pipe(
    map((values) => values.map(value => ({ ...value, amt: value.unitprice * value.qty }) as billinDETAIL)),
    // tap(value => console.log('with amount Data', JSON.stringify(value))),
    shareReplay(1)
  );

  selectdBillDtl4$ = combineLatest([
    this.billdtls$,
    this.billDtlSelectedAction$
  ]).pipe(
    switchMap(([billDtls, selectedBilDtl]) =>
      billDtls.filter(billDtl => billDtl.billno === selectedBilDtl)),
    // mergeMap((values) => ({ ...value }) as billinDETAIL),
    tap(billDtl => console.log('selectedProduct', billDtl),
      //   toArray(),
    )
  );

  //** end of correct Get data from Selected Billing Detail */

  selectedBilDtl2$ = this.billDtlSelectedAction$
    .pipe(
      filter(id => !!id),
      map(selectedBilDtl => this._http.get<billinDETAIL>(this.condtlbill + `/${selectedBilDtl}`)
        .pipe(
          // map((dtlValues =>
          //   ({ ...dtlValues, amt: dtlValues.qty * dtlValues.unitprice, }) as billinDETAIL)
          // ),
          map((value) => ({ ...value }) as billinDETAIL),
          // toArray(),
          tap(value => console.log('', JSON.stringify(value))),
          catchError(this.handleError)
        )
      )
    );

  //*** COMBINE LATEST using FIND support Only single record */

  //  selectedDtlSingle$ = combineLatest([
  //     this.billingDetail$,
  //     this.billDtlSelectedAction$
  //   ]).pipe(
  //     map(([billDtls, selectedBilDtl]) =>
  //       billDtls.filter(billDtl => billDtl.billno = selectedBilDtl)
  //     ),
  //     tap(value => console.log('Selected Data', JSON.stringify(value))),
  //   );

  //*** Change the Selected Bill detail */

  SelectedBillDetailChanged(selectedBillDtl: number): void {
    this.billDtlSelectedSubject.next(selectedBillDtl);
  }

  // SelectedBranchNameChanged(selectdBrnch: string): void {
  //   this.brnSelSubject.next(selectdBrnch);
  // }

  SelectedCustidChanged(selectedCustid: number): void {
    this.custidSelSubject.next(selectedCustid);
  }

  CurSelBranch(val: string): void {
    this.tmpBranchName = val;
  }

  SelectedBranchNameChanged(branchName: string): void {
    this.branchNameSelSubject.next(branchName);
  }

  SelectedEntityChanged(entity: string): void {
    this.entitySubject.next(entity);
  }
  //** end of script */
  billingHeader$ = this._http.get<IBillHeader[]>(this.conHdrbill)
    .pipe(
      tap(value => console.log('', JSON.stringify(value))),
      catchError(this.handleError)
    );

  //Combing the billing Detail with Customer

  // billDtlwithCustomer$ = combineLatest([
  //   this.billingDetail$,
  //   this.customerService.customerdata2022$
  // ]).pipe(
  //   map(([billdtl,customers]) =>
  //   billdtl.map(billdtl =>))
  // )
  /** */

  /// SAMPLE FOR CUSTOMER SAVING
  UpdateBillDetail(_value: IBillDtl): Observable<void> {
    const _billineno_ = `${this.condtlbill}/${_value.billineno}`;
    return this._http.put<void>(_billineno_, _value, this.httpOptions)
      .pipe(
        tap(data => console.log('Update Bill Detail', JSON.stringify(data))),
        //    catchError(this.handleError)
      );
  };

  AddingBillDetail(_value: iBillPost): Observable<void> {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //   }),
    // };
    const _billineno_ = `${this.condtlbill}`;
    return this._http.post<void>(_billineno_, _value, this.httpOptions)
      .pipe(
        tap(data => console.log('Update Bill Detail', JSON.stringify(data))),
        //    catchError(this.handleError)
      );
  };

  RemoveBillDetail(_value: number) {
    const _billineno_ = `${this.condtlbill}`;
    return this._http.delete(_billineno_ + `/` + _value);
  }


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