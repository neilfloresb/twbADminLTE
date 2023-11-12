import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxDialogComponent } from 'igniteui-angular';
import { combineLatest, EMPTY, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { BillingService } from 'src/app/service/billing.service';
import { CustomerService } from 'src/app/service/customer.service';
import { EditdtlBIllService } from 'src/app/service/editdtl-bill.service';
import { IBillHeader } from 'src/app/shared/model/billing';
import { ICustomer } from 'src/app/shared/model/customer';
import { State, process } from '@progress/kendo-data-query';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import { Terms } from 'src/app/shared/model/terms';
import { BillingComponent } from '../billing.component';
//import { toJSON } from '@progress/kendo-angular-grid/dist/es2015/filtering/operators/filter-operator.base';
//import { WindowService } from '@progress/kendo-angular-dialog';
import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';
import { mapapi } from 'src/app/shared/iUrlpath';
import { UserService } from 'src/app/service/user.service';


export interface User {
  birthDate: Date;
}

const _PrintResoure = mapapi.PrintResource;

@Component({
  selector: 'app-bil-create',
  templateUrl: './bil-create.component.html',
  styleUrls: ['./bil-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BilCreateComponent implements OnInit, OnDestroy {

  // @ViewChild("combocust", { read: IgxComboComponent, static: true })
  // public combocust: IgxComboComponent;
  @ViewChild('viewer1', { static: false }) viewer: TelerikReportViewerComponent;
  @ViewChild(IgxComboComponent, { static: true }) public combocust: IgxComboComponent;

  @ViewChild('dialogPrint', { read: IgxDialogComponent, static: true })
  public dialogPrint: IgxDialogComponent;

  @ViewChild('dialogSaving', { read: IgxDialogComponent, static: true })
  public dialogSaving: IgxDialogComponent;

  @ViewChild("lodcustId", { static: true }) lodcustId: ElementRef;

  private errorMessageSubject = new Subject<string>();

  public selectCustomer_val: any;
  public custIdSubscription: Subscription;
  public customerSubcription: Subscription;
  public termSubcription: Subscription;
  public link_report_resource = _PrintResoure;


  public min: Date = new Date(1917, 0, 1);
  public max: Date = new Date(2000, 11, 31);
  public value: Date = new Date(2000, 2, 10);

  public current_date: Date = new Date(Date.now());
  pipe = new DatePipe('en-US')
  selectedDate: string;

  public user: User;

  public _customers$: ICustomer[];
  public _terms: Terms[];
  public createForm: FormGroup;

  public selectedCustId: number;
  public selectTermID: string;
  public selectedBillDtlNo;
  public selectedTerms: string;

  public activeAdd = false;
  public activeUpdate = false;
  public isNew: boolean;

  public BillDtlview: Observable<GridDataResult>;
  public rs;

  public tmpcustid: number;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  dateTrn: string;
  dateDue: string;
  public entityVal: string;
  public userVal: string;
  public branchVal: string;

  ready() { console.log('ready'); }
  viewerToolTipOpening(e: any, args: any) { console.log('viewerToolTipOpening ' + args.toolTip.text); }

  // public createForm: FormGroup = new FormGroup({
  //   custid: new FormControl(0, Validators.required),
  //   custname: new FormControl(''),
  //   page: new FormControl(''),
  //   trndate: new FormControl(this.current_date),
  //   billno: new FormControl(''),
  //   terms: new FormControl(''),
  //   duedate: new FormControl(this.current_date),
  //   pono: new FormControl(''),
  //   remarks: new FormControl(''),
  // });

  private billEditDtlService: EditdtlBIllService
  constructor(@Inject(EditdtlBIllService) billDtlServiceFactory: any, private customerService: CustomerService, private billingService: BillingService, private route: ActivatedRoute,
    private router: Router, private fb: FormBuilder, private userService: UserService) { this.billEditDtlService = billDtlServiceFactory() }


  ngOnInit(): void {

    this.branchVal = JSON.parse(localStorage.getItem('BranchName'));
    this.userVal = JSON.parse(localStorage.getItem('userName'));

    this.createForm = this.fb.group(
      {
        custid: new FormControl('', Validators.required),
        custid2: new FormControl('', Validators.required),
        custname: new FormControl(''),
        page: new FormControl(''),
        trndate: new FormControl(this.current_date),
        billno: new FormControl(''),
        billseries: new FormControl(''),
        terms: new FormControl(''),
        duedate: new FormControl(this.current_date),
        pono: new FormControl(''),
        issuedby: new FormControl(this.userVal),
        billto: new FormControl(''),
      }
    );



    this.loadingBehaviorCustomer();
    this.loadingTerms();

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      this.selectedBillDtlNo = id;
      this.billingService.SelectedBillDetailChanged(parseInt(id));
    })

    this.findindex();
  }

  findindex() {
    const arr = [1, 2, 3, 4, 5, 4, 3, 2];
    const result = arr.filter(v => arr.indexOf(v) === arr.lastIndexOf(v));
    console.log('sample output', result);
    var curuser = localStorage.getItem('userName');
    //  this.userService.SelectedUserChanged(JSON.parse(curuser));
  }


  users$ = this.userService.twbuser$
    .pipe(
      map(values => values.filter(value => value.userid.toLocaleUpperCase() === this.userService.currentUser.toLocaleUpperCase())),
      //map(values => values.filter((value) => 'NEIL' ? value.userid === 'NEIL' : true)),
      tap(value => console.log('users datas updated', JSON.stringify(value))),
      // map(user => ({ userid: user[0].userid }) as IUser),
      // toArray(),
      // tap(data => console.log('After toArray', JSON.stringify(data))),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  // twbusr$ = this.userService.users$
  //   .pipe(
  //     tap(val => console.log('my username 3', JSON.stringify(val))),
  //   );
  username$ = this.userService.users$
    .pipe(
      tap(val => console.log('my username', JSON.stringify(val))),
    );


  loadingBehaviorCustomer() {
    this.customerSubcription = this.customerService.customers.subscribe(
      (value) => {
        this._customers$ = value,
          console.warn('customer data', value)
      }
    )
  };
  ngOnDestroy() {
    this.customerSubcription.unsubscribe();
    this.termSubcription.unsubscribe();
    // this.artistSubscription.unsubscribe();
    // this._QuoteHDRSubscription.unsubscribe();
  }

  loadingTerms() {
    this.termSubcription = this.customerService.getTermsListing().subscribe
      ((res) => {
        this._terms = res;
      })
  }


  public valueChanged(event) {
    this.dateTrn = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    //console.log( this.pipe.transform(value as Date, 'MM/dd/yyyy'));
    console.log(this.dateTrn);
  }
  public onSdateSelection(value) {
    this.dateTrn = this.pipe.transform(value as Date, 'MM/dd/yyyy');
    console.log(this.dateTrn);
  }
  formatter = (_: Date) => {
    // return _.toLocaleString("en-US");
    return this.pipe.transform(_ as Date, 'MM/dd/yyyy');
  };

  public valueChangedDue(event) {
    this.dateDue = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    //console.log( this.pipe.transform(value as Date, 'MM/dd/yyyy'));
    console.log(this.dateDue);
  }
  public onSdateSelectionDue(value) {
    this.dateDue = this.pipe.transform(value as Date, 'MM/dd/yyyy');
    console.log(this.dateDue);
  }

  public singleCustSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectCustomer_val = event.newSelection[0];
      //   console.log(this._custIDnewValue);
    } else {
      event.newSelection = [];
    }
  }
  // public singleTermsSelection(event: IComboSelectionChangeEventArgs) {
  //   if (event.added.length) {
  //     event.newSelection = event.added;
  //     this.selectTermID = event.newSelection[0];
  //     //   console.log(this._custIDnewValue);
  //   } else {
  //     event.newSelection = [];
  //   }


  //** view customer and get */
  // customer$ = this.customerService.customerdata2022$.pipe(
  customer$ = this.customerService.customerdata2022$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  viewCustomer$ = this.customer$.pipe(
    map(value => value),
    //  tap(value => console.log('customerdata', JSON.stringify(value))),
  );
  //** end of script */


  //** POST Bill Master Details */
  // postBillDetail$ = this.billingService.billingDetail$.pipe(
  //   catchError((err) => {
  //     this.errorMessageSubject.next(err);
  //     return EMPTY;
  //   })
  // );
  // postBillHdr$ = this.billingService.billHeader$.pipe(
  //   catchError((err) => {
  //     this.errorMessageSubject.next(err);
  //     return EMPTY;
  //   })
  // );


  // postBillDtlHdr$ = combineLatest([
  //   this.postBillHdr$, this.postBillDetail$
  // ]).pipe(
  //   map(([billHdr, billdtl]) => ({ billHdr, billdtl })),
  //   // toArray(),
  //   tap(data => console.log('BILLdataMERGE', JSON.stringify(data))),
  // )

  //** END of Post Bill Script */

  //** GET Billing Details */
  billingDetails$ = this.billingService.selectdBillDtl4$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  viewBillDtl$ = this.billingDetails$.pipe(
    map(value => value),
    tap(value => console.log('Bill Detail', JSON.stringify(value))),
  );

  //** GET Billing Details  version 2*/
  // billingDetails3$ = this.billingService.billingDetail4$.pipe(
  //   catchError((err) => {
  //     this.errorMessageSubject.next(err);
  //     return EMPTY;
  //   })
  // );

  // viewBillDtl4$ = this.billingDetails3$.pipe(
  //   map(value => value),
  //   tap(value => console.log('Bill Detail after 4', JSON.stringify(value))),
  // );

  selectedCustidforBill = this.billingService.custidSelectedAction$;

  viewDrd$ = this.billingService.dRDlistforBill$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  viewforDrdbilling$ = this.viewDrd$.pipe(
    map(value => value),
    tap(value => console.log('drd LIST Detail for BILLING', JSON.stringify(value))),
  );

  //*** */
  billHdr$ = this.billingService.SelectedBillHdr$.pipe(
    //  tap(billHdr => console.log('Bill hdr Selected', JSON.stringify(billHdr))),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  SelectedBillHdrId$ = this.billingService.billDtlSelectedAction$;

  BillHeaderGetSelected$ = combineLatest(
    [this.billHdr$, this.SelectedBillHdrId$, this.billingService.billingWITHcrud$]
  ).pipe(
    map(([billhdr, selectedBillHdrId, modiHdr]) => ({ billhdr, selectedBillHdrId, modiHdr })),
    // tap(selectedBilHdrId => console.log('Sample Data', JSON.stringify(selectedBilHdrId))),
    //tap(selectedBilHdrId => this.patchBillHdr(selectedBilHdrId.billhdr)),
    tap(selectedBilHdrId => {
      if (selectedBilHdrId.billhdr == undefined) {
        // this.router.navigate(['path/to'])
        //   .then(() => {
        window.location.reload();
        // this.billingService.refreshData();
        //  this.ngOnInit();
        // });
      } else {
        this.patchBillHdr(selectedBilHdrId.billhdr);
      }
    })
  );

  mapCurrentValue() {
    let billHeader: IBillHeader = {
      billno: this.createForm.value.billno,
      billto: this.createForm.value.billto,
      billseries: this.createForm.value.billseries,
      custid: this.selectedCustId,
      trndate: this.dateTrn,
      duedate: this.dateDue,
      page: this.createForm.value.page,
      terms: this.selectedTerms,
      pono: this.createForm.value.pono,
      issuedby: this.createForm.value.issuedby,
      branchname: this.branchVal,
      userid: this.userVal,
    };
    console.log('data from bill header', billHeader);
    this.billingService.UpdateBillHdr(billHeader);
    // this.billingService.SelectedBillDetailChanged(this.billCurrentSeriesno);
    // this._router.navigate(['/home/billing/create', this.billCurrentSeriesno]);
  };

  UpdateBillHdr() {
    //this.billingService.addBillHdr();
    //this.billingService.UpdateBillHdr();
    // this.mapCurrentValue();
    this.dialogSaving.open();
  }

  refresh(): void {
    window.location.reload();
  }

  patchBillHdr(billHdr: IBillHeader) {
    //  patchBillHdr() {
    let tempcusid: any = `${billHdr.custid}`;
    let trnDate = `${billHdr.trndate}`;
    this.dateTrn = this.pipe.transform(trnDate, 'MM/dd/yyyy');
    let dueDate = `${billHdr.duedate}`;
    this.dateDue = this.pipe.transform(dueDate, 'MM/dd/yyyy');
    let terms = `${billHdr.terms}`;
    this.selectedTerms = terms.trim();
    let page = `${billHdr.page}`;
    let billno = `${billHdr.billno}`;
    let billseries = `${billHdr.billseries}`;
    let billto = `${billHdr.billto}`;
    this.selectedCustId = parseInt(tempcusid.trim());
    this.selectCustomer_val = parseInt(tempcusid.trim());

    //this.combocust.setSelectedItem(parseInt(`${billHdr.custid}`),true);
    let _billHdr = {
      pono: `${billHdr.pono}`,
      issuedby: `${billHdr.issuedby}`,
      trndate: new Date(trnDate),
      duedate: new Date(dueDate),
      custid2: parseInt(tempcusid.trim()),
      terms: terms,
      page: page,
      billno: billno,
      billseries: billseries,
      billto: billto
    }

    this.createForm.patchValue(_billHdr);
    this.tmpcustid = this.selectCustomer_val;
    this.BillDtlview = this.billEditDtlService.pipe(map(value => process(value, this.gridState)),
    );
    // console.log('dtlview: ', this.BillDtlview);
    this.billEditDtlService.ReadBillDtlNo(this.selectedBillDtlNo);
  }


  public onCustChange(value) {
    //** get Selected customer from kendoCombo */
    this.selectedCustId = value;
    console.log('Data From combo Telerik', value);
  }


  public onTermChange(value) {
    //** get Selected customer from kendoCombo */
    this.selectedTerms = value;
    console.log('Data From combo Terms Telerik', value);
  }

  //**  */
  billingHeader$ = this.billingService.selectedbillHeader2$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  // billingDetial$ = this.billingService.billDetail2ndBEST$.pipe(
  //   catchError((err) => {
  //     this.errorMessageSubject.next(err);
  //     return EMPTY;
  //   })
  // );

  vm2viewDummy$ = combineLatest(
    [this.billingHeader$, this.SelectedBillHdrId$]
  ).pipe(
    map(([billHeader, selectedBillHdrId]) => ({ billHeader, selectedBillHdrId })),
    tap(selectedBilHdrId => console.log('Sample HEIGHER order mapping', JSON.stringify(selectedBilHdrId.billHeader))),
  )



  private closeForm(): void {
    this.activeAdd = false;
    this.activeUpdate = false;
    //  this.cancel.emit();
  }

  addHandler(event) {
    // this.editDataItem = new Product();
    this.isNew = true;
  }


  onSelected(val: number) {
    let custid: number = 195380;
    this.billingService.SelectedCustidChanged(+custid);
  }

  public cancel() {
    this.dialogPrint.close();
    //this.viewer.clearReportSource();
  }

  public Printevent() {
    // this.dialogPrint.open();
    // this.rs = {
    //   report: 'billingStatementTwb.trdp',
    //   parameters: { sqno: rowID }
    // };

    //  if (this._entity == "TWINBEE") {
    this.dialogPrint.open();
    this.rs = {
      report: 'billingStatementTwb.trdp',
      parameters: { billno: this.selectedBillDtlNo }
    };
    //  }

    this.viewer.refreshReport()
    /*** SET REPORTSOURCE is import to Refresh Report */
    this.viewer.setReportSource(this.rs);
  }

  title = 'Report Viewer';
  viewerContainerStyle = {
    position: 'relative',
    width: '800px',
    height: '400px',
    ['font-family']: 'Verdana, Arial,Effra'
  };

  onDialogOKSelected(args) {
    this.mapCurrentValue();
    this.dialogSaving.close();
    window.location.reload();
  }

  closeSaving() {
    this.dialogSaving.close();
    window.location.reload();
  }

}
