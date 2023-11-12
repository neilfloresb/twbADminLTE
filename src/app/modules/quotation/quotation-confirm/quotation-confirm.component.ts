import { DatePipe } from '@angular/common';
//import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Input, ViewChild, OnDestroy, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxDatePickerComponent, IgxToastComponent } from 'igniteui-angular';
import { Observable, Subject, Subscription } from 'rxjs';
//import { QuotationService } from 'src/app/service/booktype.service';
import { QuoteService } from 'src/app/service/quote.service';
import { IConfirmQuotation } from 'src/app/shared/model/quotation';


@Component({
  selector: 'app-quotation-confirm',
  templateUrl: './quotation-confirm.component.html',
  styleUrls: ['./quotation-confirm.component.scss']
})
export class QuotationConfirmComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild("conDate", { read: IgxDatePickerComponent, static: true })
  public conDate: IgxDatePickerComponent;
  @ViewChild("delDate", { read: IgxDatePickerComponent, static: true })
  public delDate: IgxDatePickerComponent;
  @ViewChild("toast", { read: IgxToastComponent, static: true })
  public toast: IgxToastComponent;

  public currentDate;

  pipe = new DatePipe('en-US');

  public _condate: Date = new Date(Date.now());
  public _delDate: Date = new Date(Date.now() + 7);

  @Output() ConfirmEmit = new EventEmitter<any>();

  @Input() deleteRequest = new EventEmitter<any>();

  //public quotationData: IQuotation;
  //** INVOKE from parent to child */
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  //** */
 public _tmpsqno: string;
  private _sqno;
  @Input()
  set sqno(val: string) {
    this._sqno = val;
    //this._tmpsqno = val;
    this.tempsqno();
  }
  get sqno(): string {
    return this._sqno;
  }
  confirmationForm: FormGroup;
  conForm: IConfirmQuotation;
  confirmSubscription: Subscription;
  constructor(private serConfirm: QuoteService, private fb: FormBuilder) { }

  // formConfirm = {
  //   confirm_date: "",
  //   confirm_ref: "",
  //   deldate: "",
  //   sqno: ""
  // };



  ngOnInit(): void {
      this.confirmationForm = this.fb.group({
      sqno: [this.sqno],
      confirm_date: [this._condate],
      confirm_ref: '',
      deldate: [this._delDate],
    })

    // console.log(this.currentDate);
    this.eventsSubscription = this.events.subscribe(() => { this.doSomething() });

  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    console.log('ngdestroy')
  }
  public ConfirmQuotaion() {

    this.doSomething();
  }
  ngAfterViewInit(){
    console.log(this._tmpsqno);
  }

  tempsqno(){
    this._tmpsqno = this.sqno;
    console.log(this._tmpsqno);
  }
  public doSomething() {

    if (this._tmpsqno !== '') {
    //  console.log(this.confirmationForm.value)
      let _x = this.pipe.transform(this.confirmationForm.value.confirm_date as Date, 'MM/dd/yyyy');
      let _y = this.pipe.transform(this.confirmationForm.value.deldate as Date, 'MM/dd/yyyy');
      //let _x = new Date(this.confirmationForm.value.confirm_date).toLocaleString().slice(0, 10);
     // let _y = new Date(this.confirmationForm.value.deldate).toLocaleString().slice(0, 10);
      this.serConfirm.form_confirm = {
        sqno: this._tmpsqno,
        confirm_date: _x,
        confirm_ref: this.confirmationForm.value.confirm_ref,
        deldate: _y,
      };
      /*** UPDATE HEADER FORM */
      this.serConfirm.ConfirmQuotation(this.serConfirm.form_confirm).subscribe(
        () => {
          //this.toast.show();
          this.ConfirmEmit.emit();
        }
      ),
        (err: any) => console.log(err)
    }
  }

}
  // public changeDate(event) {
  //   const input = event.target.value;
  //   if (input !== "") {
  //     const parsedDate = new Date(input);
  //     if (this.isDateValid(parsedDate)) {
  //       this.currentDate = parsedDate;
  //     } else {
  //       console.log("Invalid Date");
  //     }
  //   } else {
  //     this.conDate.deselectDate();
  //     this.currentDate = input;
  //   }
  // }

  // private isDateValid(date: Date): boolean {
  //   return new Date(date).toLocaleString() !== "Invalid Date";
  // }


