import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxDatePickerComponent } from 'igniteui-angular';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { BillingService } from 'src/app/service/billing.service';
import { CustomerService } from 'src/app/service/customer.service';
import { UserService } from 'src/app/service/user.service';
import { IBillHeader } from 'src/app/shared/model/billing';

@Component({
  selector: 'app-newbill',
  templateUrl: './newbill.component.html',
  styleUrls: ['./newbill.component.scss']
})
export class NewbillComponent implements OnInit {
  @ViewChild("trndate", { read: IgxDatePickerComponent, static: true })
  trndate: IgxDatePickerComponent;
  @ViewChild("duedate", { read: IgxDatePickerComponent, static: true })
  duedate: IgxDatePickerComponent;

  // public createForm: FormGroup;
  public current_date: Date = new Date(Date.now());
  pipe = new DatePipe('en-US')
  selectedDate: string;

  dateTrn: string;
  dateDue: string;
  public entityVal: string;
  public userVal: string;
  public branchVal: string;
  public billCurrentSeriesno: number;

  //public current_date: Date = new Date(Date.now());

  public selectCustomer_val: number;
  public selectTermID: string;

  @ViewChild(IgxComboComponent, { static: true }) public combocust: IgxComboComponent;

  constructor(private customerService: CustomerService, private billingService: BillingService, private _router: Router, private userService: UserService) { }

  private errorMessageSubject = new Subject<string>();

  ngOnInit(): void {
    this.branchVal = JSON.parse(localStorage.getItem('BranchName'));
   // this.userVal = JSON.parse(localStorage.getItem('userName'));
    //this.branchVal = this.userService.userValue.branch;
    this.userVal = this.userService.userValue.userid;
    console.log(this.userVal);

  }

  public createForm: FormGroup = new FormGroup({
    custid: new FormControl(0, Validators.required),
    custname: new FormControl(''),
    page: new FormControl('1'),
    trndate: new FormControl(this.current_date),
    billno: new FormControl(''),
    billseries: new FormControl('1'),
    billto: new FormControl(''),
    terms: new FormControl('', Validators.required),
    duedate: new FormControl(this.current_date),
    pono: new FormControl('1'),
    // issuedby: new FormControl(JSON.parse(localStorage.getItem('userName').toUpperCase())),
    issuedby: new FormControl(this.userService.userValue.userid),
  });


  // customer$ = this.customerService.customerdata2022$.pipe(
  //   map(values => values.filter(values => values.entity)),
  //   tap(value => console.log('Customer Datas', JSON.stringify(value))),
  //   catchError(this.handleError)
  // );

  public singleCustSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectCustomer_val = event.newSelection[0];
      //   console.log(this._custIDnewValue);
    } else {
      event.newSelection = [];
    }
  }

  public singleTermsSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectTermID = event.newSelection[0];
      //   console.log(this._custIDnewValue);
    } else {
      event.newSelection = [];
    }
  }


  billhdr$ = this.billingService.billingWITHcrud$.pipe(
    map(values => values),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })

  )

  billhdr2$ = this.billingService.billingWITHcrud$.pipe(
    map(values => values),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })

  )

  customer$ = this.billingService.customer$.pipe(
    // map(values => values),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  viewCustomer$ = combineLatest([this.customer$, this.billhdr$, this.billhdr2$]).pipe(
    map(([values, billhdr, billHdr2]) => ({ values, billhdr, billHdr2 })),
    tap(values => console.log('customerdata new ', JSON.stringify(values))),
    //  tap(value => this.combocust.setSelectedItem(this.selectCustomer_val))
  );

  terms$ = this.customerService.terms$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  )

  viewTerms$ = this.terms$.pipe(
    map((values) => values),
    //  tap(values => console.log('Terms Data:', JSON.stringify(values))),
  )

  mapCurrentValue() {
    if (this.dateTrn == undefined) {
      this.dateTrn = this.pipe.transform(Date.now(), 'MM/dd/yyyy');
    }

    if (this.dateDue == undefined) {
      this.dateDue = this.pipe.transform(Date.now(), 'MM/dd/yyyy');
    }

    let billHeader: IBillHeader = {
      billno: this.billCurrentSeriesno,
      billto: this.createForm.value.billto,
      billseries: this.createForm.value.billseries,
      custid: this.selectCustomer_val,
      trndate: this.dateTrn,
      duedate: this.dateDue,
      page: this.createForm.value.page,
      terms: this.selectTermID,
      pono: this.createForm.value.pono,
      issuedby: this.createForm.value.issuedby,
      branchname: this.branchVal,
      userid: this.userVal
    };
    console.log('data from bill header', billHeader);
    this.billingService.addBillHdr(billHeader);
    //this.billingService.SelectedBillDetailChanged(this.billCurrentSeriesno);
  //  this._router.navigate(['/home/billing/create', this.billCurrentSeriesno]);
  };

  getCurrentBillNo() {
    this.billingService.getBillSeriesno()
    .pipe(
      map(billno => billno[0]),
      take(1)).subscribe(
        res => {this.billCurrentSeriesno = res.billno;
          //console.log('current billno', res.billno);
          this.mapCurrentValue();
      //    this._router.navigate(['/home/billing/create', this.billCurrentSeriesno]);
        }
      )
  }

  addBillHdr() {
    // this.billingService.addBillHdr();
    // this.billingService.UpdateBillHdr();
    // console.log(this.createForm.value)
   // this.mapCurrentValue();

   /* CALL this function and GET CURRENT BILL SERIES NO. */
   this.getCurrentBillNo();

  }

  updateBillHdr() {
   // this.billingService.UpdateBillHdr();
  }
  formatter = (_: Date) => {
    // return _.toLocaleString("en-US");
    return this.pipe.transform(_ as Date, 'MM/dd/yyyy');
  };
  public valueChanged(event) {
    this.dateTrn = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    console.log(this.pipe.transform(event as Date, 'MM/dd/yyyy'));
    console.log(this.dateTrn);
  }
  public onSdateSelection(value) {
    this.dateTrn = this.pipe.transform(value as Date, 'MM/dd/yyyy');
    console.log(this.dateTrn);
  }

  public valueChangedDue(event) {
    this.dateDue = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    //console.log( this.pipe.transform(value as Date, 'MM/dd/yyyy'));
    console.log(this.dateDue);
  }
  public onSdateSelectionDue(value) {
    this.dateDue = this.pipe.transform(value as Date, 'MM/dd/yyyy');
    console.log(this.dateDue);
  }

}
