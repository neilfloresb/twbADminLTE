import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { timeStamp } from 'console';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxDatePickerComponent } from 'igniteui-angular';
import { BehaviorSubject, combineLatest, EMPTY, Subject, Subscription } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { CustomerService } from 'src/app/service/customer.service';
import { PaymentService } from 'src/app/service/payment.service';
import { UserService } from 'src/app/service/user.service';
import { ICustomer } from 'src/app/shared/model/customer';
import { IPaymentHdr } from 'src/app/shared/model/payment';
import { IUser } from 'src/app/shared/model/users';

@Component({
  selector: 'app-newpayment',
  templateUrl: './newpayment.component.html',
  styleUrls: ['./newpayment.component.scss']
})
export class NewpaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IgxComboComponent, { static: true }) public combosample: IgxComboComponent;
  @ViewChild(IgxComboComponent, { static: true }) public combocust: IgxComboComponent;
  //  @ViewChild(IgxComboComponent, { static: true }) public combodoctype: IgxComboComponent;
  @ViewChild(IgxComboComponent, { static: true }) public cboBank: IgxComboComponent;
  @ViewChild(IgxComboComponent, { static: true }) public cboPayType: IgxComboComponent;
  @ViewChild("trndate", { read: IgxDatePickerComponent, static: true })
  trndate: IgxDatePickerComponent;
  @ViewChild("chkdate", { read: IgxDatePickerComponent, static: true })
  chkdate: IgxDatePickerComponent;

  private amtpaidSubject = new BehaviorSubject<number>(0);
  amtpaid$ = this.amtpaidSubject.asObservable();


  public current_date: Date = new Date(Date.now());
  pipe = new DatePipe('en-US')
  selectedDate: string;

  dateTrn: string;
  dateChk: string;

  _docType: {};
  _payType: {};
  public selectCustomer_val: number;
  public selDoctype_val: string;
  public selBank: number;
  public selPayType: string;
  public toggleItemState = false;

  public customerSubcription: Subscription;
  public doctypeSubscription: Subscription;
  public _customers$: ICustomer[];
  public selectedCustId: number;
  public selectedDocID: string;
  public selectedBankID: number;
  public selectedPayID: string;

  private current_user: string;
  private current_branch: string;

  public paidInitial: number;
  codeIDSeries: string;

  public age: number;
  user: IUser;

  constructor(private paymentService: PaymentService, private fb: FormBuilder, private customerService: CustomerService, private userService: UserService) {
    this.user = this.userService.userValue;
  }

  private errorMessageSubject = new Subject<string>();

  public createForm: FormGroup;
  // public createForm: FormGroup = new FormGroup({
  //   paydocno: new FormControl(''),
  //   custid: new FormControl(0, Validators.required),
  //   // custname: new FormControl(''),
  //   bank: new FormControl(''),
  //   doctype: new FormControl(''),
  //   paytype: new FormControl(''),
  //   trndate: new FormControl(this.current_date),
  //   chkdate: new FormControl(this.current_date),
  //   amtpaid: new FormControl(0),
  //   unamtap: new FormControl(0),
  //   amtap: new FormControl(5),
  //   chkno: new FormControl(''),
  //   refno: new FormControl(''),
  //   status: new FormControl('CANCEL'),
  //   remarks: new FormControl(''),
  // });

  ngOnInit(): void {

    // this.loadingBehaviorCustomer();

     this.current_branch =  this.userService.userValue.branch;
     this.current_user = this.userService.userValue.userid;

    this._docType = this.paymentService.doctype;
    this._payType = this.paymentService.paytype;

    this.createForm = this.fb.group({
      paydocno: new FormControl(''),
      custid: new FormControl('', Validators.required),
      // custid2: new FormControl(613, Validators.required),
      // custname: new FormControl(''),
      bank: new FormControl(0),
      doctype: new FormControl("OR"),
      paytype: new FormControl("CS"),
      trndate: new FormControl(this.current_date),
      chkdate: new FormControl(this.current_date),
      // amtpaid: [Validators.min(1), Validators.pattern(/^[1-9]\d*$/)],
      amtpaid: new FormControl(0, Validators.pattern(/^[1-9]\d*$/)),
      unamtap: new FormControl(0),
      amtap: new FormControl(0),
      chkno: new FormControl(''),
      refno: new FormControl(''),
      status: new FormControl('CANCEL'),
      remarks: new FormControl(''),
    });
  }

  loadingBehaviorCustomer() {
    this.customerSubcription = this.customerService.customers.subscribe(
      (value) => {
        this._customers$ = value,
          console.warn('customer data', value)
      }
    )
  };

  ngOnDestroy() {
    //this.customerSubcription.unsubscribe();
    //    this.termSubcription.unsubscribe();
  }

  ngAfterViewInit() {
    //   this.combodoctype.setSelectedItem('OR', this.toggleItemState);
    //this.combocust.setSelectedItem(613, true);
  }

  public onCustChange(value) {
    //** get Selected customer from kendoCombo */
    this.selectedCustId = value;
    console.log('Data From combo Telerik: ', value);
  }
  public onDocTypeChange(value) {
    this.selectedDocID = value;
  }
  public onBankNameChange(value) {
    this.selectedBankID = value;
  }
  public onPaytypeChange(value) {
    this.selectedPayID = value;
  }

  // toggleItem(itemID) {
  //   this.toggleItemState = !this.toggleItemState;
  //   //   this.combodoctype.setSelectedItem('OR', this.toggleItemState);
  //   this.combosample.setSelectedItem(613, true);
  // }

  customer$ = this.paymentService.customer$.pipe(
    // map(values => values),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  bankname$ = this.paymentService.bankname$.pipe(
    // map(values => values),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  viewCustomer$ = combineLatest([this.customer$, this.bankname$]).pipe(
    map(([values, bankname]) => ({ values, bankname })),
    tap(bankname => console.log('customerdata new ', JSON.stringify(bankname))),
    //  tap(value => this.combocust.setSelectedItem(this.selectCustomer_val))
  );

  public singleCustSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectCustomer_val = event.newSelection[0];
      console.log(this.selectCustomer_val);
    } else {
      event.newSelection = [];
    }
  }

  public singleDocTypeSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selDoctype_val = event.newSelection[0];
      console.log(this.selDoctype_val);
    } else {
      event.newSelection = [];
    }
  }

  public singleBankSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selBank = event.newSelection[0];
      console.log(this.selBank);
    } else {
      event.newSelection = [];
    }
  }
  public singlePayTypeSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selPayType = event.newSelection[0];
      console.log(this.selPayType);
    } else {
      event.newSelection = [];
    }
  }

  public valueTranChanged(event) {
    this.dateTrn = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    console.log(this.pipe.transform(event as Date, 'MM/dd/yyyy'));
    console.log(this.dateTrn);
  }
  public ontrndateSelection(value) {
    this.dateTrn = this.pipe.transform(value as Date, 'MM/dd/yyyy');
    console.log(this.dateTrn);
  }

  public onChkDateSelection(event) {
    this.dateChk = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    console.log(this.pipe.transform(event as Date, 'MM/dd/yyyy'));
    console.log(this.dateChk);
  }
  public valueChkDateChanged(value) {
    this.dateChk = this.pipe.transform(value as Date, 'MM/dd/yyyy');
    console.log(this.dateChk);
  }

  formatter = (_: Date) => {
    // return _.toLocaleString("en-US");
    return this.pipe.transform(_ as Date, 'MM/dd/yyyy');
  };

  //patchBillHdr(payHdr: IPaymentHdr) {
  patchBillHdr() {

    //  let docSeriesno = `${payHdr.paydocno}`;
    // let billto = `${billHdr.billto}`;
    // this.selectedCustId = parseInt(tempcusid.trim());
    // this.selectCustomer_val = parseInt(tempcusid.trim());

    //this.combocust.setSelectedItem(parseInt(`${billHdr.custid}`),true);
    let _payHdr = {
      // pono: `${billHdr.pono}`,
      // issuedby: `${billHdr.issuedby}`,
      // trndate: new Date(trnDate),
      // duedate: new Date(dueDate),
      // custid2: parseInt(tempcusid.trim()),
      // terms: terms,
      // page: page,
      // billno: billno,
      paydocno: this.codeIDSeries,
    }
    this.createForm.patchValue(_payHdr);

    // this.tmpcustid = this.selectCustomer_val;

    // this.BillDtlview = this.billEditDtlService.pipe(map(value => process(value, this.gridState)),
    // );
    // this.billEditDtlService.ReadBillDtlNo(this.selectedBillDtlNo);
  }


  mapCurrentValue() {
    if (this.dateTrn == undefined) {
      this.dateTrn = this.pipe.transform(Date.now(), 'MM/dd/yyyy');
    }

    if (this.dateChk == undefined) {
      this.dateChk = this.pipe.transform(Date.now(), 'MM/dd/yyyy');
    }

    let payHeader: IPaymentHdr = {
      paydocno: this.createForm.value.paydocno,
      custid: this.selectedCustId,
      doctype: this.selectedDocID,
      paytype: this.selectedPayID,
      bank_code: this.selectedBankID,
      paymentdate: this.dateTrn,
      chkdate: this.dateChk,
      chkno: this.createForm.value.chkno,
      amt_paid: this.createForm.value.amtpaid,
      amt_applied: this.createForm.value.amtap,
      status_mode: this.createForm.value.status,
      branchname: this.current_branch,
      userid: this.current_user.toUpperCase()
      //    status?: StatusCode;


      // billno: this.billCurrentSeriesno,
      // billto: this.createForm.value.billto,
      // billseries: this.createForm.value.billseries,
      // custid: this.selectCustomer_val,
      // trndate: this.dateTrn,
      // duedate: this.dateDue,
      // page: this.createForm.value.page,
      // terms: this.selectTermID,

      //    branchname: this.branchVal,
      //    userid: this.userVal
    };
    console.log('data from bill header', payHeader);
    // this.billingService.addBillHdr(billHeader);

  };

  getCurrentSeriesNo() {
    if (this.selectedDocID == undefined) {
      this.selectedDocID = 'OR';
    }

    this.paymentService.getSeriesNO(this.selectedDocID)
      .pipe(
        map(values => values[0]),
        take(1)).subscribe(
          res => {
            if (this.selectedDocID == 'OR') {
              this.codeIDSeries = res.orno;
              console.log('current billno', this.codeIDSeries);
            } else if (this.selectedDocID == 'CR') {
              this.codeIDSeries = res.cono;
              console.log('current billno', this.codeIDSeries);
            } else if (this.selectedDocID == 'PR') {
              this.codeIDSeries = res.prno;
              console.log('current billno', this.codeIDSeries);
            }
            this.patchBillHdr()
            this.mapCurrentValue();
          }
        )
  }

  addPayment() {
    console.log(this.createForm.value);
    this.getCurrentSeriesNo();
  }

  amtapp$ = this.amtpaid$.pipe(
    map((ap) => {
      const tax = ap * (12 / 100);
      const unapp = ap - (ap / 100);
      return {
        appliedAmt: unapp,
        appliedtax: tax
      };
    }
    )
  );

  amtpaidChanged(amt: number): void {
    this.amtpaidSubject.next(amt);
  }
  public onChange(value: number): void {

    this.amtpaidChanged(value);
    console.log(`valueChange ${value}`);
  }
}
