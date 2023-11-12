import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridDataResult, StringFilterComponent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { IgxGridCellComponent, IgxGridComponent } from 'igniteui-angular';
import { EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BillingService } from 'src/app/service/billing.service';
import { EditbillService } from 'src/app/service/editbill.service';
import { EditdtlBIllService } from 'src/app/service/editdtl-bill.service';
import { BillDetail, billinDETAIL, IBillDtl, iBillPost } from 'src/app/shared/model/billing';

const tmpbranch = JSON.parse(localStorage.getItem('BranchName'));

@Component({
  selector: 'app-dtl-bill',
  templateUrl: './dtl-bill.component.html',
  styleUrls: ['./dtl-bill.component.scss'],
})
export class DtlBillComponent implements OnInit {
  @ViewChild('grid1', { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;


  public billDtlView: Observable<GridDataResult>;
  private errorMessageSubject = new Subject<string>();

  saveAddSubscription: Subscription;
  removeSubscription: Subscription;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 20,
    // Initial filter descriptor
    filter: {
      logic: "and",
      filters: [{ field: "custname", operator: "contains", value: "" }],
    }
  };

  public billDtlDataItem: IBillDtl;
  public billPostData: iBillPost;
  tmpDrno: string;

  public selectedBillId: number;
  public isNew: boolean;

  public AddNew: boolean;


  @Input()
  set tmpBillDtlNo(val: number) {
    this.selectedBillId = val;
  }
  get tmpBillDtlNo(): number {
    return this.selectedBillId;
  }

  public SelCustId: number;
  @Input()
  set tmpcustid(val: number) {
    this.SelCustId = val;
  }
  get tmpcustid(): number {
    return this.SelCustId;
  }

  public mySelection: number[] = []

  public removeSelectedbillno: number;


  private billdtlEditService: EditbillService;
  constructor(@Inject(EditbillService) custeditServiceFactory: any, private route: ActivatedRoute, private _router: Router, private billingService: BillingService) {
    this.billdtlEditService = custeditServiceFactory();
  }

  ngOnInit(): void {
    this.goView()
  }

  goView() {
    this.billDtlView = this.billdtlEditService.pipe(map((res) => process(res, this.gridState)),
      tap(res => console.log('this sample data: ', JSON.stringify(res)))
    );
    this.billdtlEditService.ReadBillDetails(this.tmpBillDtlNo);
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.billdtlEditService.ReadBillDetails(this.tmpBillDtlNo);
  }

  addHandler(dataItem) {
    // this.billDtlDataItem = new BillDetail();
    // this.isNew = true;
    this.AddNew = true;
    this.billDtlDataItem = dataItem.billno;
    console.log('Temp Custid', tmpbranch);
    // onSelected(val: number) {
    //   let custid: number = 195380;
    this.billingService.CurSelBranch(tmpbranch);
    this.billingService.SelectedCustidChanged(this.tmpcustid);
    // this.billingService.SelectedBranchNameChanged(tmpbranch);
    // }
  }
  editHandler({ dataItem }) {
    // this.editDataItem = dataItem;
    this.billDtlDataItem = dataItem;
    this.isNew = false;
  }

  cancelHandler() {
    this.billDtlDataItem = undefined;
  }

  saveHandler(customer: IBillDtl) {
    this.billdtlEditService.saveBillDetail(this.tmpBillDtlNo, customer, this.isNew);
    this.billDtlDataItem = undefined;
  }

  removeHandler({ dataItem }) {
    console.log(dataItem.billineno);
    this.removeSelectedbillno = dataItem.billineno;
    this.RemoveBillDtl(this.removeSelectedbillno);
    this.billdtlEditService.remove(this.tmpBillDtlNo, dataItem);
    window.location.reload();
  }

  onCancelAdd() {
    this.AddNew = false;
  }
  onSaveAdd() {
    this.AddNew = false;
    let ids = "0000000003";
    this.InsertSaveBillDtl();
    this._router.navigate(['/home/billing/create', this.tmpBillDtlNo]);

   // window.location.reload();
   this.goView();
    window.location.reload();

  };

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


  handleSelection(event) {
    // console.log('ONSELECTIONEVENTFIRED');
    const targetCell = event.cell as IgxGridCellComponent;
    // //   console.log(event)
    this.tmpDrno = targetCell.rowData["drno"].trim()
    console.log(targetCell.rowData["drno"].trim());
    // this.grid1.selectRows([targetCell.row.rowID], true)
    // = targetCell.rowData["status"].trim();
    //console.log(this.quoteStatus);
  }

  public handleRowSelection(event) {
    console.log(event);
  }

  InsertSaveBillDtl() {

    this.billPostData = {
      billno: this.tmpBillDtlNo,
      drno: this.tmpDrno,
    };
    // this.editForm.patchValue(_entity);

    // if (!this.isNew) {
    this.saveAddSubscription = this.billingService.AddingBillDetail(this.billPostData).subscribe(
      () => {
      }
    ),
      (err: any) => console.log(err);
    //}
  }

  RemoveBillDtl(val: number) {

    this.billPostData = {
      billno: this.tmpBillDtlNo,
      drno: this.tmpDrno,
    };
    // this.editForm.patchValue(_entity);

    // if (!this.isNew) {
    this.removeSubscription = this.billingService.RemoveBillDetail(val).subscribe(
      () => {
      }
    ),
      (err: any) => console.log(err);
    //}
  }


}
