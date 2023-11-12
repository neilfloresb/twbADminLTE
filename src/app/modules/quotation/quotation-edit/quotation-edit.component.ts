import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxDatePickerComponent, IgxDialogComponent, IgxDropDownComponent, IgxSelectComponent, ISelectionEventArgs } from 'igniteui-angular';
import { timeStamp } from 'node:console';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, share, shareReplay, switchMap, take } from 'rxjs/operators';
import { CustomerState } from 'src/app/customer/state/customer.reducer';
import { selectCustomers } from 'src/app/customer/state/customer.selector';
import { QuotationService } from 'src/app/service/booktype.service';
import { CustomerService } from 'src/app/service/customer.service';
import { QuoteService } from 'src/app/service/quote.service';
import { Artist } from 'src/app/shared/model/artist';
import { ICustomer } from 'src/app/shared/model/customer';
import { IQuotation, IQuoteDTL } from 'src/app/shared/model/quotation';
import { Terms } from 'src/app/shared/model/terms';
import * as fromCustomerActions from '../../../customer/state/customer.actions';
import { CusteditService } from '../quote-tel/custedit.service';

@Component({
  selector: 'app-quotation-edit',
  templateUrl: './quotation-edit.component.html',
  styleUrls: ['./quotation-edit.component.scss']
})
export class QuotationEditComponent implements OnInit, OnDestroy {
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

  @ViewChild('seldelivery', { read: IgxSelectComponent, static: true })
  public seldelivery: IgxSelectComponent

  @ViewChild("dropDown_vat") public dropDown_vat: IgxDropDownComponent;

  @ViewChild('dialogPrint', { read: IgxDialogComponent, static: true })
  public dialogPrint: IgxDialogComponent;

  public _customerdata: ICustomer[];
  customerdata$: Observable<ICustomer[]>;


  public quotationData: IQuotation;
  public selectCustomer_val: number = 613;

  public selectCustomer_val2: number = 613;
  public selectTerm_val: string;
  public selectArt_val: number;
  public selectedDelivery: string;
  public selectedVAT: string;
  public quoteCurrentSeriesno: string;
  public curSelectedVAT: string;
  public curSelectedDel: string;


  public current_date: Date = new Date(Date.now());
  pipe = new DatePipe('en-US')

  selectedDate: string;
  public quoteForm: FormGroup;

  public _termdata: Terms[];
  public _artistdata: Artist[];
  public artist_data$: Observable<Artist[]>;
  public term_data$: Observable<Terms[]>;

  public _vattype;
  public _delivery;
  public current_sqno;
  public _discnt_;

  public discount_value;
  public discount_value_flag: boolean = true;

  value = '000';
  mask = '##.##';
  placeholder = '##.00%';
  displayFormat = new DisplayFormatPipe();
  inputFormat = new InputFormatPipe();

  _quotationDetail_data: IQuoteDTL[];

  _QuoteHDRSubscription: Subscription;
  customerSubcription: Subscription;
  termSubcription: Subscription;
  artistSubscription: Subscription;

  public hasConfirmed: boolean = false;
  public hasDisable: boolean = false;


  private custDataSample: Observable<any>;

  constructor(private fb: FormBuilder, private store: Store<CustomerState>, private quotationService: CustomerService,
    private _quotesvr: QuotationService, private _quote: QuoteService, private router: Router, private route: ActivatedRoute, private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe, private samplecustedit: CusteditService) {

  }

  ngOnInit(): void {
    this.current_sqno = this.route.snapshot.paramMap.get('id');

    /*** */
    this.quoteForm = this.fb.group({
      sqno: [''],
      custid: [''],
      contactp: [''],
      artcode: [''],
      remarks: [''],

      status: [''],
      discnt: [],

      sqdate: [],
      vat_type: [''],
      termid: [''],
      delivery: [''],
    });
    // sqdate: [this.current_date, { validators: Validators.required, updateOn: 'blur' }],
    this.quoteForm.valueChanges.subscribe(newval => {
      if (newval.discnt) {
        if (this.discount_value !== newval.discnt) {
          this.discount_value = newval.discnt;
          //  this.discount_value = newval.discnt / 100;
          ///     let new_ = this.currencyPipe.transform(newval.discnt.replace(/\b/g, '').replace(/^0+/, ''), 'Php ', 'symbol', '1.0-0')
          let _newdiscnt = {
            discnt: this.discount_value,
          }
          //  console.log('componeent...', this.discount_value);
          this.quoteForm.patchValue({ _newdiscnt }, { emitEvent: false });
          this.discount_value_flag = false;
        }
      }
    }
    );
    // this.quoteForm.valueChanges.subscribe(form => {
    //   if (form.discnt) {
    //     this.quoteForm.patchValue({
    //       discnt: this.currencyPipe.transform(form.discnt.replace(/\b/g, '').replace(/^0+/, ''), 'USD', 'symbol', '1.0-0')
    //     }, { emitEvent: false });
    //   }
    // })
    /** */



    this.loadCustomer();

    // this.getQuotationService();
    this._vattype = this._quotesvr.vattype;
    this._delivery = this._quotesvr.deliverytype;

    //   this.getQuoteNOSeries();
    // /** INVOKE THE CURRENT QUOTATION NO. */
    // this.getCurrentQuotationNO();
  }

  loadCustomer() {
    let branchval = JSON.parse(localStorage.getItem('entity'));

    if (branchval == "TWINBEE") {
      this.customerSubcription = this.quotationService.getCustomerForListing().subscribe(
        (_resCustomer) => {
          this._customerdata = _resCustomer;
          this.getQuotationService();
          this.getCustomerListing();

        }
      )
    } else {
      this.customerSubcription = this.quotationService.getCustomerForListingforANS().subscribe(
        (_resCustomer) => {
          this._customerdata = _resCustomer;
          this.getQuotationService();
          this.getCustomerListing();

        }
      )
    }

    // if (branchval == "ANS") {
    //   this.store.dispatch(fromCustomerActions.loadANSCustomers());
    //   this.getCustomerListing();
    // } else {
    //   this.store.dispatch(fromCustomerActions.loadCustomers());
    //   this.getCustomerListing();
    // }

  }

  ngOnDestroy() {
    this.customerSubcription.unsubscribe();
    this.termSubcription.unsubscribe();
    this.artistSubscription.unsubscribe();
    this._QuoteHDRSubscription.unsubscribe();
  }

  /** get artist and terms */
  getQuotationService() {
    const branchval = JSON.parse(localStorage.getItem('BranchName'));
    this.artistSubscription = this.quotationService.getARTISTlisting(branchval)
      .subscribe((_artist_) => {
        this._artistdata = _artist_;
        // this.artist_data$ = _artist_;
      });

    this.termSubcription = this.quotationService.getTermsListing()
      .subscribe((_terms_) => {
        this._termdata = _terms_;
      });

    // const _artist_ = this.quotationService.getARTISTlisting(branchval);
    // const _terms_ = this.quotationService.getTermsListing();

    // forkJoin([_artist_, _terms_]).pipe(shareReplay()).subscribe(result => {
    //   this._artistdata = result[0];
    //   this._termdata = result[1];
    // });

    //*** USING MAP to retrieve TABLE */
    //**  PROBLEM encounter when retrieve and load to combox delayed if not using SUBSCRIPTION */
    this.artist_data$ = this.quotationService.getARTISTlisting(branchval);
    this.quotationService.getARTISTlisting(branchval)
      .pipe(
        map(val => {
          return val
        }))
      .subscribe(res => {
        //   this.artist_data$ = res;
        //  console.log(this.artist_data);
      },
        (err) => console.log(err))

    this.term_data$
  }


  /** Get CUSTOMER  */
  getCustomerListing() {
    //   this.customerdata$ = this.store.pipe(select(selectCustomers));
    //    console.log(this.customerdata$);
    //  this.getQuotationService();
    /** INVOKE THE CURRENT QUOTATION NO. */
    this.getCurrentQuotationNO();
  }

  getCurrentQuotationNO() {
    //const quoteCurrentSeriesno = this._quote.getQUATATIONhdr();

    this._QuoteHDRSubscription = this._quote.getQuotationByNO(this.current_sqno)
      .subscribe((res) => {
        this.quotationData = res[0];
        //  console.log('Get Selected Data to Edit / Update...:' + this.quotationData);
        this.selectCustomer_val = res[0].custid;
        this.combocust.setSelectedItem(this.selectCustomer_val, true);
        this.comboart.setSelectedItem(res[0].artcode, true);
        this.comboterms.setSelectedItem(res[0].termid);
        this.selectvat.value = res[0].vat_type;
        this.curSelectedVAT = res[0].vat_type;
        this.seldelivery.value = res[0].delivery;
        this.curSelectedDel = res[0].delivery;
        this.discount_value = res[0].discnt;
        this.discount_value_flag = true;
        this.mapValueByPatch();
      },
        (err) => console.log(err)
      )

    // this._quote.getQuotationByNO(this.current_sqno)
    //   .pipe(
    //     map(val => {
    //       return val
    //     }))
    //   .subscribe(res => {

    //     this.quotationData = res[0];
    //     console.log(this.quotationData);
    //     this.selectCustomer_val = res[0].custid;
    //     this.combocust.setSelectedItem(this.selectCustomer_val, true);
    //     this.comboart.setSelectedItem(res[0].artcode, true);
    //     this.comboterms.setSelectedItem(res[0].termid);
    //     this.selectvat.value = res[0].vat_type;
    //     this.curSelectedVAT = res[0].vat_type;
    //     this.seldelivery.value = res[0].delivery;
    //     this.curSelectedDel = res[0].delivery;
    //     this.mapValueByPatch();
    //     //   this.getQuotationDETAILS();
    //   })
  }

  getQuotationDETAILSalpha() {
    this._quote.getQuotationDetailByNO(this.current_sqno)
      .pipe(
        map(val => {
          return val
        })
      ).subscribe(result => {
        console.log(result);
      })
  }

  mapValueByPatch() {
    this._discnt_ = this.quotationData.discnt.toFixed(5);
    let _status = this.quotationData.status;
    if (_status == "CONFIRMED" || _status == "SERVED") {
      this.hasConfirmed = true;
      this.hasDisable = false;
    } else if (_status == "NEW") {
      this.hasConfirmed = false;
      this.hasDisable = true;
    } else if (_status == "CANCEL") {
      this.hasConfirmed = true
      this.hasDisable = true;
    }

    let _curDate = new Date(this.quotationData.sqdate);
    console.log("My date" + _curDate);
    this.selectedDate = this.pipe.transform(_curDate as Date, 'MM/dd/yyyy');
    console.log("My date2" + this.selectedDate);
    let _quotHdr_ = {
      sqno: this.quotationData.sqno,
      contactp: this.quotationData.contactp,
      remarks: this.quotationData.remarks,
      sqdate: _curDate,
      status: this.quotationData.status,
      discnt: this.discount_value,
      // vat_type: this.quotationData.vat_type
      // custid: this.selectCustomer_val,
    }
    this.quoteForm.patchValue(_quotHdr_);
  }

  /** Invoke to Save Quotation Hdr */
  public Save() {
    this.mapCurrentValues();
  }


  public singleCustSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectCustomer_val = event.newSelection[0];

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
    };
    this.comboart.close();
    // let _curArtsel = {
    //   artcode: event.newSelection[0],
    // }
    // this.quoteForm.patchValue(_curArtsel);
  }
  public singleTermSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.selectTerm_val = event.newSelection[0];
    } else {
      event.newSelection = [];
    }
    this.comboterms.close();
  }



  public valueChanged(event) {
    //this.selectedDate = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    //console.log( this.pipe.transform(value as Date, 'MM/dd/yyyy'));
    //   console.log(this.selectedDate);
  }
  public onSdateSelection(value) {
    this.selectedDate = this.pipe.transform(value as Date, 'MM/dd/yyyy');
    //    console.log(this.selectedDate);
  }

  // formatter = (_: Date) => {
  //   // return _.toLocaleString("en-US");
  //   return this.pipe.transform(_ as Date, 'MM/dd/yyyy');
  // };

  valtoFixed(_discnt: number) {
    return _discnt.toFixed(2);
  }
  mapCurrentValues() {
    let _discntNewVal = this.quoteForm.value.discnt / 100;
    let _dateSave = new Date(this.selectedDate).toLocaleString().slice(0, 10);
    let _dateSave2 = this.selectedDate;
    let _userid = JSON.parse(localStorage.getItem('userName')).toUpperCase();
    console.log(_dateSave2);
    this._quote.quoteForm = {
      sqno: this.quoteForm.value.sqno,
      custid: this.selectCustomer_val,
      vat_type: this.curSelectedVAT,
      termid: this.selectTerm_val,
      warranty: '',
      delivery: this.curSelectedDel,
      sqdate: _dateSave2,
      acperson: JSON.parse(localStorage.getItem('name')),
      contactp: this.quoteForm.value.contactp,
      remarks: this.quoteForm.value.remarks,
      branchname: JSON.parse(localStorage.getItem('BranchName')),
      userid: JSON.parse(localStorage.getItem('userName')).toUpperCase(),
      artcode: this.selectArt_val,
      discnt: this.discount_value,
      status: this.quoteForm.value.status,
      //sqdate: new Date(this.selectedDate).toLocaleString().slice(0, 10),
      //     confirm_date: '',
      //     so_no: ''
      //    quoteflag: 'NO',
    };
    console.log(this._quote.quoteForm);

    /*** UPDATE HEADER FORM */
    this._quote.UpdateQuoteHeader(this._quote.quoteForm).subscribe(
      () => {
        //  this.router.navigate(['home/quotation/list']);
        this.getQuotationDETAILS();
        // this.getCustomerListing();
        // this.current_sqno = this.quoteForm.value.sqno;
        // this.curSelectedVAT = this.quoteForm.value.vat_type;
      }
    ),
      (err: any) => console.log(err);


    /*** UPDATE FOR CUSTOMER SAMPLE */

    // this.quoteForm2 = this.fb.group({
    //   sqno: [''],
    //   custid: [''],
    //   contactp: [''],
    //   artcode: [''],
    //   remarks: [''],

    //   status: [''],
    //   discnt: [],

    //   sqdate: [],
    //   vat_type: [''],
    //   termid: [''],
    //   delivery: [''],
    // });

    //this.custDataSample = {}; // custname: ['SAMPLE 2022'], cperson:['SAMPLE 2022']};


    // // this._ = {}
    // this.samplecustedit.saveCustomer2(this._quote.quoteForm).subscribe(
    //   () => {
    //     //  this.router.navigate(['home/quotation/list']);
    //    // this.getQuotationDETAILS();
    //     // this.getCustomerListing();
    //     // this.current_sqno = this.quoteForm.value.sqno;
    //     // this.curSelectedVAT = this.quoteForm.value.vat_type;
    //   }
    // ),
    //   (err: any) => console.log(err);


  }

  /** Get the Quotation Details */
  getQuotationDETAILS() {
    this._quote.getQuotationDetailByNO(this.current_sqno)
      .pipe(
        map(val => {
          return val
        })
      ).subscribe(result => {
        this._quotationDetail_data = result;
        //  this.PrintPreview();
      })
  }

  public SelectDelivery(event: ISelectionEventArgs) {
    this.selectedDelivery = event.newSelection.value;
    this.curSelectedDel = event.newSelection.value;
  }

  public SelectVAT(event: ISelectionEventArgs) {
    /** second line active */
    this.selectedVAT = event.newSelection.value;
    this.curSelectedVAT = event.newSelection.value;
  }


  // /**   */

  //   public valuek = 5;
  //   public events: string[] = [];

  //   public onFocus(): void {
  //     this.log('NumericTextBox is focused');
  //   }

  //   public onBlur(): void {
  //     this.log('NumericTextBox is blurred');
  //   }

  //   public onChange(value: string): void {
  //     this.log(`valueChange ${value}`);
  //   }

  //   private log(event: string): void {
  //     this.events.unshift(`${event}`);
  //   }

  // /** */
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
      //  val = '00.00';
    }

    if (val.indexOf(' %') !== -1) {
      val = val.replace(new RegExp(' %', 'g'), '');
    }

    if (val.indexOf('-') !== -1) {
      val = val.replace(new RegExp('-', 'g'), '');
    }
    //  debugger;
    return val;
  }
}

@Pipe({
  name: 'customFormatter'
})
export class CustomFormatterPipe {
  transform(val: string, ...args: any[]) {
    const format = args[0] ? '1.0-2' : '1.0-0';
    return this.decimalPipe.transform(val, format);
  }

  constructor(private decimalPipe: DecimalPipe) { }
}
