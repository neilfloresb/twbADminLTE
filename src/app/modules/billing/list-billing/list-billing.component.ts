import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxGridCellComponent, IgxGridComponent } from 'igniteui-angular';
import { combineLatest, EMPTY, fromEvent, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { BillingService } from 'src/app/service/billing.service';
import { QuotationService } from 'src/app/service/booktype.service';
import { CustomerService } from 'src/app/service/customer.service';
import { UserService } from 'src/app/service/user.service';
import { IBillHeader } from 'src/app/shared/model/billing';
import { ICustomer } from 'src/app/shared/model/customer';

@Component({
  selector: 'app-list-billing',
  templateUrl: './list-billing.component.html',
  styleUrls: ['./list-billing.component.scss']
})
export class ListBillingComponent implements OnInit, OnDestroy {
  @ViewChild("combocust", { read: IgxComboComponent, static: true })
  public combocust: IgxComboComponent;

  @ViewChild('grid1', { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;

  public toggleItemState = false;
  // Error messages
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  @ViewChild('btn', { static: true }) button: ElementRef;

  public _customerdata: ICustomer[];
  customerSubcription: Subscription;
  buttonSubscription: Subscription;
  billSubScription: Subscription;

  public billHdrData: IBillHeader;

  createForm: FormGroup;
  mycustId$: Observable<any>;
  private tmpBillNo: string;

  public selectCustomer_val: number;
  constructor(private quotationService: CustomerService, private fb: FormBuilder, private billservice: BillingService, private _router: Router, private userService: UserService) { }

  ngOnInit(): void {

    this.billservice.SelectedEntityChanged(this.userService.currentBranch);
    //     this.createForm = this.fb.group(
    //       {
    //         custid: [''],
    //         // custid2: new FormControl('', Validators.required),
    //         // custname: new FormControl(''),
    //         // page: new FormControl(''),
    //         // // trndate: new FormControl(this.current_date),
    //         // // billno: new FormControl(''),
    //         // // terms: new FormControl(''),
    //         // // duedate: new FormControl(this.current_date),
    //         // pono: new FormControl(''),
    //         // remarks: new FormControl(''),
    //       }
    //     );

    //     this.customerSubcription = this.quotationService.getCustomerForListing().subscribe(
    //       (value) => {
    //         this._customerdata = value;
    //         console.log('value', value);
    //         //   this.selectCustomer_val = 57100;
    //         this.mycustId$ = of(57100, 998);
    //         //this.getCustId();

    //  //       this.GetCurrentBill();
    //       }
    //     )

   this.billservice.refreshData();
  }

  ngOnDestroy(): void {
    // this.customerSubcription.unsubscribe();
  }

  // GetCurrentBill() {
  //   let billnoto = 3;
  //   this.billSubScription = this.billservice.GetBillHdrNO(billnoto)
  //     .subscribe((res) => {
  //       this.billHdrData = res[0];
  //       console.log(this.billHdrData);
  //       this.selectCustomer_val = res[0].custid;
  //     })
  // }

  // getCustId() {
  //   let myID = of(this.selectCustomer_val);
  //   myID.pipe(
  //     map(value => { return value }
  //     )
  //   )
  //     .subscribe(ret => {
  //       console.log('Redd', + ret);
  //     })
  // };

  // getCustomer(itemID) {
  //   this.combocust.setSelectedItem(itemID, true);
  // }

  // public singleCustSelection(event: IComboSelectionChangeEventArgs) {
  //   // console.log(event);
  //   if (event.added.length) {
  //     event.newSelection = event.added;
  //     //     this.selectCustomer_val = event.newSelection[0];
  //   } else {
  //     event.newSelection = [];
  //   }
  // }

  refresh(): void {
    this.billservice.refreshData();
  }


  SelectedBranchName$ = this.billservice.entityAction$;

  billHdr$ = this.billservice.getBillHdrByBRANCH$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  // billHdr$ = combineLatest([this.billservice.getBillHdrByBRANCH$,this.billservice.cumulativeBillHdr$]).pipe(
  //   catchError(err => {
  //     this.errorMessageSubject.next(err);
  //     return EMPTY;
  //   })
  // )

  // viewBillHdr$ = this.billHdr$.pipe(
  //   map(value => value),
  //   tap(value => console.log('BRANCHDATA', JSON.stringify(value))),
  //   //  tap(value => this.combocust.setSelectedItem(this.selectCustomer_val))
  // );

  viewBillHdr$ = combineLatest([this.billHdr$, this.billservice.billingWITHcrud$]).pipe(
    //   catchError(err => {.pipe(
    map(([billhdr, billcum]) => ({ billhdr, billcum})),
    tap(value => console.log('BRANCHDATA', JSON.stringify(value))),
    //  tap(value => this.combocust.setSelectedItem(this.selectCustomer_val))
  );

  public EditBill(event, rowID) {
    console.log(rowID);
    this._router.navigate(['/adminboard/billing/create', rowID]);
  }


  handleSelection(event) {
    // console.log('ONSELECTIONEVENTFIRED');
    const targetCell = event.cell as IgxGridCellComponent;
    // //   console.log(event)
    //  this.tmpDrno = targetCell.rowData["drno"].trim()
    console.log(targetCell.rowData["billno"]);
    // this.grid1.selectRows([targetCell.row.rowID], true)
    // = targetCell.rowData["status"].trim();
    //console.log(this.quoteStatus);
  }
  // buttonClick() {
  //   this.buttonSubscription = fromEvent(this.button.nativeElement, 'click')
  //     .pipe(debounceTime(300))
  //     .subscribe(res => console.log(res));
  // }
  // ngAfterViewInit() {
  //   this.buttonClick();
  // }
  // toggleItem() {
  //   //  this.toggleItemState = !this.toggleItemState;
  //   this.combocust.setSelectedItem(this.selectCustomer_val, true);
  // }

}
