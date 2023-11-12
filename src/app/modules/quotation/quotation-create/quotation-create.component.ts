import { DatePipe } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxDatePickerComponent, IgxDropDownComponent, IgxSelectComponent, ISelectionEventArgs } from 'igniteui-angular';
import { timeStamp } from 'node:console';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { CustomerState } from 'src/app/customer/state/customer.reducer';
import { selectCustomers } from 'src/app/customer/state/customer.selector';
import { BooktypeService, QuotationService } from 'src/app/service/booktype.service';
import { CustomerService } from 'src/app/service/customer.service';
import { QuoteService } from 'src/app/service/quote.service';
import { Artist } from 'src/app/shared/model/artist';
import { ICustomer } from 'src/app/shared/model/customer';
import { Terms } from 'src/app/shared/model/terms';
import * as fromCustomerActions from '../../../customer/state/customer.actions';

@Component({
  selector: 'app-quotation-create',
  templateUrl: './quotation-create.component.html',
  styleUrls: ['./quotation-create.component.scss']
})
export class QuotationCreateComponent implements OnInit {
  @ViewChild("trandate", { read: IgxDatePickerComponent, static: true })
  trandate: IgxDatePickerComponent;
  @ViewChild("combocust", { read: IgxComboComponent, static: true })
  public combocust: IgxComboComponent;

  @ViewChild("comboterms", { read: IgxComboComponent, static: true })
  public comboterms: IgxComboComponent;

  @ViewChild("comboart", { read: IgxComboComponent, static: true })
  public comboart: IgxComboComponent;

  @ViewChild('selectWar', { read: IgxSelectComponent, static: true })
  public selectWar: IgxSelectComponent
  @ViewChild('selectvat', { read: IgxSelectComponent, static: true })
  public selectvat: IgxSelectComponent

  @ViewChild('selectdelivery', { read: IgxSelectComponent, static: true })
  public selectdelivery: IgxSelectComponent

  @ViewChild("dropDown_vat") public dropDown_vat: IgxDropDownComponent;



  public _customerdata: ICustomer[];
  customerdata$: Observable<ICustomer[]>;
  public selectCustomer_val: number;
  public selectTerm_val: string;
  public selectArt_val: number;
  public selectedDelivery: string;
  public selectedVAT: string;
  public quoteCurrentSeriesno: string;


  public current_date: Date = new Date(Date.now());
  pipe = new DatePipe('en-US')

  selectedDate: string;
  public quoteForm: FormGroup;

  public _termdata: Terms[];
  public _artistdata: Artist[];

  public _vattype;
  public _delivery;

  value = '000';
  mask = '000';
  placeholder = '### %';
  displayFormat = new DisplayFormatPipe();
  inputFormat = new InputFormatPipe();

  constructor(private fb: FormBuilder, private store: Store<CustomerState>, private quotationService: CustomerService,
    private _quotesvr: QuotationService, private _quote: QuoteService, private router: Router, private route: ActivatedRoute) {
    this.quoteForm = this.fb.group({
      sqno: [''],
      custid: [''],
      contactp: [''],
      artcode: [''],
      remarks: [''],

      status: ['NEW'],
      discnt: [''],

      sqdate: [this.current_date, { validators: Validators.required, updateOn: 'blur' }],
      vat_type: [''],
      termid: [''],
      delivery: [''],
    })
  }

  ngOnInit(): void {

    let entityVal = JSON.parse(localStorage.getItem('entity'));
    if (entityVal == "ANS") {
    this.store.dispatch(fromCustomerActions.loadANSCustomers());
    this.getCustomerListing()
    } else {
      this.store.dispatch(fromCustomerActions.loadCustomers());
      this.getCustomerListing()
    };


    this.getQuotationService();
 ///   console.log(this._quotesvr.deliverytype);
    this._vattype = this._quotesvr.vattype;
    this._delivery = this._quotesvr.deliverytype;

    //   this.getQuoteNOSeries();

    this.getSampleViewQuotation();
  }

  /** get artist and terms */
  getQuotationService() {
    const branchval = JSON.parse(localStorage.getItem('BranchName'))
    //console.log(branchval);
    const _artist_ = this.quotationService.getARTISTlisting(branchval);
    const _terms_ = this.quotationService.getTermsListing();

    forkJoin([_artist_, _terms_]).pipe(take(1)).subscribe(result => {
      this._artistdata = result[0];
     // console.log(this._artistdata);
      //  this.bokCurValue = [this._hdr2[0].book_code];
      this._termdata = result[1];

  //    console.log(this._termdata);

    });

  }

  /** Get CUSTOMER  */
  getCustomerListing() {
    this.customerdata$ = this.store.pipe(select(selectCustomers));
    //    console.log(this.customerdata$);
  }

  getSampleViewQuotation() {
    //const quoteCurrentSeriesno = this._quote.getQUATATIONhdr();
    const tmpranch = JSON.parse(localStorage.getItem('BranchName'));
    const tempuser = JSON.parse(localStorage.getItem('userName'));

    this._quote.getQUATATIONhdr(tmpranch, tempuser)
      .pipe(
        map(val => {
          return val
        }))
      .subscribe(res => {
      //  console.log(res);
      })
  }

  /** Get Current Quotation NO. */
  getQuoteNOSeries() {
    const quoteCurrentSeriesno = this._quote.getQuotataionSeriesno();
    this._quote.getQuotataionSeriesno()
      .pipe(
        map(idno => idno[0]),
        take(1)
      ).subscribe(res => {
        this.quoteCurrentSeriesno = res.sq_no;
   //     console.log(this.quoteCurrentSeriesno);
        this.mapCurrentValues();
      })
  }

  public Save() {
//    console.log(this.quoteForm.value);
    this.getQuoteNOSeries();
    // this.mapCurrentValues();


  }
  public singleCustSelection(event: IComboSelectionChangeEventArgs) {
    // console.log(event);
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectCustomer_val = event.newSelection[0];
      //   console.log(this._custIDnewValue);
    } else {
      event.newSelection = [];
    }
    this.combocust.close();
  }
  public singleArtSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectArt_val = event.newSelection[0];
      //   console.log(this._custIDnewValue);
    } else {
      event.newSelection = [];
    }
    this.comboart.close();
  }
  public singleTermSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectTerm_val = event.newSelection[0];
      //   console.log(this._custIDnewValue);
    } else {
      event.newSelection = [];
    }
    this.comboterms.close();
  }

  public valueChanged(event) {
    this.selectedDate = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    //console.log( this.pipe.transform(value as Date, 'MM/dd/yyyy'));
  //  console.log(this.selectedDate);
  }
  public onSdateSelection(value) {
    this.selectedDate = this.pipe.transform(value as Date, 'MM/dd/yyyy');
//    console.log(this.selectedDate);
  }

  formatter = (_: Date) => {
    // return _.toLocaleString("en-US");
    return this.pipe.transform(_ as Date, 'MM/dd/yyyy');
  };

  mapCurrentValues() {

    this._quote.quoteForm = {
      sqno: this.quoteCurrentSeriesno,
      custid: this.selectCustomer_val,
      vat_type: this.selectedVAT,
      termid: this.selectTerm_val,
      warranty: '',
      delivery: this.selectedDelivery,
      sqdate: new Date(this.quoteForm.value.sqdate).toLocaleString().slice(0, 10),
      acperson: JSON.parse(localStorage.getItem('AEname')) + " " +JSON.parse(localStorage.getItem('AElastname')) ,
      contactp: this.quoteForm.value.contactp,
      remarks: this.quoteForm.value.remarks,
      branchname: JSON.parse(localStorage.getItem('BranchName')),
      userid: JSON.parse(localStorage.getItem('userName')),
      artcode: this.selectArt_val,
      discnt: parseFloat(this.quoteForm.value.discnt) / 100,
      status: this.quoteForm.value.status,
      //     confirm_date: '',
      //     so_no: ''
      //    quoteflag: 'NO',
    };
  //  console.log(this._quote.quoteForm);

    /*** SAVE HEADER FORM */

    this._quote.CreateQuoteHeader(this._quote.quoteForm).subscribe(
      () => {
        this.router.navigate(['home/quotation/edit/' + this.quoteCurrentSeriesno ]);
      }
    ),
      (err: any) => console.log(err)

  }

  public SelectDelivery(event: ISelectionEventArgs) {
  //  console.log(event);
    this.selectedDelivery = event.newSelection.value;
  }

  public SelectVAT(event: ISelectionEventArgs) {
    this.selectedVAT = event.newSelection.value;
  }

}

/*** */
// @Pipe({ name: "displayFormat" })
// export class DisplayFormatPipe implements PipeTransform {
//   public transform(value: any): string {
//     return value + " %";
//   }
// }

// @Pipe({ name: "inputFormat" })
// export class InputFormatPipe implements PipeTransform {
//   public transform(value: any): string {
//     return value;
//   }
// }

/*** */

@Pipe({ name: 'displayFormat' })
export class DisplayFormatPipe implements PipeTransform {
  transform(value: any): string {
    let val = value;

    if (val === '__.__') {
      val = '';
    }

    if (val && val.indexOf('_') !== -1) {
      val = val.replace(new RegExp('_', 'g'), '0');
    }

    if (val && val.indexOf('%') === -1) {
      val += ' %';
    }

    if (val && val.indexOf('-') === -1) {
      val = val.substring(0, 0) + '-' + val.substring(0);
    }

    return val;
  }
}

@Pipe({ name: 'inputFormat' })
export class InputFormatPipe implements PipeTransform {
  transform(value: any): string {
    let val = value;

    if (!val) {
      val = '__.__';
    }

    if (val.indexOf(' %') !== -1) {
      val = val.replace(new RegExp(' %', 'g'), '');
    }

    if (val.indexOf('-') !== -1) {
      val = val.replace(new RegExp('-', 'g'), '');
    }

    return val;
  }
}