import { Component, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { IGLJVheader } from 'src/app/shared/model/glJVHeader';
import * as GledgerActions from '../state/gledger.actions';
import { AppState } from 'src/app/store';
import { GljvService } from 'src/app/service/gljv.service';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxDatePickerComponent } from 'igniteui-angular';
import { BooktypeService } from '../../../service/booktype.service';
import { DatePipe } from '@angular/common';
import { glControNO } from 'src/app/shared/model/acctgaccounts';
import { AcctgaccountsService } from 'src/app/service/acctgaccounts.service';
//import { timeStamp } from 'node:console';

@Component({
  selector: 'app-gljv-add',
  templateUrl: './gljv-add.component.html',
  styleUrls: ['./gljv-add.component.scss']
})
export class GljvAddComponent implements OnInit {
  @ViewChild("jvtransdate", { read: IgxDatePickerComponent, static: true })
  jvtransdate: IgxDatePickerComponent;
  @ViewChild("combobook", { read: IgxComboComponent, static: true })
  public combobook: IgxComboComponent;


  _gljvHeader: IGLJVheader;
  public _ref_no: string;

  isGlJVInStore$: Observable<boolean>;
  gljvheader$: Observable<IGLJVheader>;

  glctrlno: glControNO[];
  _jvcontrolnoSubscription: Subscription;
  _ctrlno_ : number;


  public drHeaderData: IGLJVheader[];
  // idrheader: iDrHeader;
  public current_date: Date = new Date(Date.now());
  //current_date = new Date(Date.now()) ;

  pipe = new DatePipe('en-US')
  //this.pipe.transform(value as Date, 'MM/dd/yyyy');
  selectedDate: string;

  public _bookService;
  book_sel_value: string;
  public cs_type: { _type: string }[];

  public isNewEntry: Boolean = false;


  public glJVForm: FormGroup;
  constructor(private store: Store<AppState>, private fb: FormBuilder, private glservice: GljvService, private bokservice: BooktypeService,
    private _glconrtrolservice: AcctgaccountsService) {
    this.glJVForm = this.fb.group({
      ref_no: [''],
      source: ['GLS'],
      trans_code: ['JV'],
      book_code: [''],
      trans_date: [this.current_date, { validators: Validators.required, updateOn: 'blur' }],
      fiscal_year: [this.current_date.getFullYear()],
      fiscal_period: ['03'],
      exch_rate: [0],
      currency_code: ['PHP'],
      userid: [JSON.parse(localStorage.getItem('userName'))],
      remarks: [''],
    });

  }

  ngOnInit(): void {
    this.resetForm();
    this._bookService = this.bokservice.bookstype;
    //  console.log(this._bookService);
    this.cs_type = [{ '_type': 'CUS' }, { '_type': 'SUP' }];
    this._ref_no = "1123118";

  }

  resetForm() {
    //if (this.glJVForm = null)
    // this.glJVForm.reset();
    this.setValue();
  }

  setValue() {
    let _glHeader_ = {
      source: 'GLS',
      trans_code: 'JV',
      book_code: 'GJ',
      //  trans_date: this.pipe.transform(this.current_date as Date, 'MM/dd/yyyy'),
      fiscal_year: this.current_date.getFullYear(),
      fiscal_period: ("0" + (this.current_date.getMonth() + 1)).slice(-2),
      exch_rate: 0,
      currency_code: 'Php',
      userid: JSON.parse(localStorage.getItem('userName')),

    }
    this.glJVForm.patchValue(_glHeader_);
  }

  UpdateValue() {
    this.glJVForm.patchValue(
      { ref_no: '112312' }
    );
  }

  /** CRUD FUNCTION  */
  InsertCustomer() {
    this.mapcustomerNewValue();
  }

  UpdateCustomer() {
    this.mapcustomerUpdateValue();
  }

  deleteCustomer() {
    const id: string = '000000011'
    this.store.dispatch(GledgerActions.deleteJVHeader({ id }));
  }
  mapcustomerNewValue() {

    console.log(this.glJVForm.value);

    // this.glservice.InsertJVHeader(this.drdForm.value).subscribe(
    //   () => {
    //     console.log('Success')
    //   }
    // ),
    //   (err: any) => console.log(err)
    this.store.dispatch(GledgerActions.addJVHeader({ gledgers: this.glJVForm.value }));
  }

  mapcustomerUpdateValue() {
    console.log(this.glJVForm.value);
    this.store.dispatch(GledgerActions.upsertJVHeader({ gledgers: this.glJVForm.value }));
  }

  public Save() {
    console.log(this.glJVForm.value);
    this.getControlNo(this.glJVForm.value.book_code);
    //this.mapCurrentValues();
    //this.store.dispatch(GledgerActions.addJVHeader({ gledgers: this.glservice.gljvForm }));
  }

  /** GET CONTROL NO */
  getControlNo(book_code: string) {
    this._jvcontrolnoSubscription = this._glconrtrolservice.getGLCONTROLNO(book_code).subscribe(
      (_ctrlno_) => {
        this.glctrlno = _ctrlno_;
        this._ctrlno_ = _ctrlno_[0].control_no + 1;
        console.log(this.glctrlno);
        this.glJVForm.patchValue(
          { ref_no: this._ctrlno_ }
        );
        this.mapCurrentValues();
        this.store.dispatch(GledgerActions.addJVHeader({ gledgers: this.glservice.gljvForm }));
      },
      (err) => console.log(err)
    )
  }
  /** CRUD FUNCTION END here */

  public valueChanged(event) {
    this.selectedDate = this.pipe.transform(event as Date, 'MM/dd/yyyy');
    //console.log( this.pipe.transform(value as Date, 'MM/dd/yyyy'));
    console.log(this.selectedDate);
  }

  public onSdateSelection(value) {
    this.selectedDate = this.pipe.transform(value as Date, 'MM/dd/yyyy');
    console.log(this.selectedDate);
  }

  mapCurrentValues() {
    this.glservice.gljvForm = {
      ref_no: this._ctrlno_.toString(),
      source: this.glJVForm.value.source,
      trans_code: this.glJVForm.value.trans_code,
      book_code: this.book_sel_value,
      trans_date: this.pipe.transform(this.glJVForm.value.trans_date as Date, 'MM/dd/yyyy'),
      fiscal_year: this.glJVForm.value.fiscal_year,
      fiscal_period: this.glJVForm.value.fiscal_period,
      exch_rate: 53.00,
      currency_code: "PHP",
      userid: JSON.parse(localStorage.getItem('userName')),
      remarks: this.glJVForm.value.remarks
    };
  }
  formatter = (_: Date) => {
    // return _.toLocaleString("en-US");
    return this.pipe.transform(_ as Date, 'MM/dd/yyyy');
  };

  get trans_date() {
    return this.glJVForm.get("trans_date");
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.book_sel_value = event.newSelection[0];
      //   console.log(this._custIDnewValue);
    } else {
      event.newSelection = [];
    }
    this.combobook.close();
  }
  OnSample(){
    console.log('Successful');
  }
}
