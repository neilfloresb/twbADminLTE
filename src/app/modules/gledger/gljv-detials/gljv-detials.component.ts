//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
//import { Input } from 'hammerjs';
import { ConnectedPositioningStrategy, IComboSelectionChangeEventArgs, IgxComboComponent, IgxDialogComponent, IgxDropDownComponent, IgxGridCellComponent, IgxGridComponent, IgxInputGroupComponent, Transaction } from 'igniteui-angular';
//import * as EventEmitter from 'node:events';
import { Subscription } from 'rxjs';
import { GljvService } from 'src/app/service/gljv.service';
import { IGLacconts, JVaccts } from 'src/app/shared/model/acctgaccounts';
import { IGLJVdetails, jvgl_CRUDdetail } from 'src/app/shared/model/glJVHeader';
import { AcctgaccountsService } from '../../../service/acctgaccounts.service';

@Component({
  selector: 'app-gljv-detials',
  templateUrl: './gljv-detials.component.html',
  styleUrls: ['./gljv-detials.component.scss']
})
export class GljvDetialsComponent implements OnInit {

  @ViewChild("grdglDetails", { read: IgxGridComponent, static: true })
  public grdglDetails: IgxGridComponent;

  @ViewChild("cAcctCombo", { read: IgxComboComponent, static: true })
  public cAcctCombo: IgxComboComponent;
  @ViewChild("dropDown") public dropDown: IgxDropDownComponent;
  @ViewChild("dropDown_cstype") public dropDown_cstype: IgxDropDownComponent;
  @ViewChild("inputGroup") public inputGroup: IgxInputGroupComponent;
  @ViewChild("dialogAdd", { read: IgxDialogComponent, static: true })
  public dialog: IgxDialogComponent;

  @ViewChild("acct_code", { read: IgxComboComponent, static: true })
  public acct_code: IgxComboComponent;

  public _ref_no: string;


  selection = true;
  sel_row: any;

  public _jv_gl_crud_details;
  public _jvDetailsData: IGLJVdetails[];
  public _gl_acct_title_data: IGLacconts[];
  public _jvAcctsDataCodeOnly: JVaccts[];

  acct_sel_value: string;
  acct_By_code: JVaccts[];
  acct_by_desc: string;

  public errors: any[];

  public cs_type: { _type: string }[];
  public for_acct_code: string;
  public for_acct_desc: string;
  public addNewRow: boolean = false;
  public counter: number = 1;


  constructor(private gljvService: GljvService, private gl_acct_title_service: AcctgaccountsService) { }

  _jvDetailSubscription: Subscription;
  _glAccount_titleSubscription: Subscription;
  _jvAcctsSubscription: Subscription;
  _jvbycodeSubscription: Subscription;

  public transactionsData: Transaction[] = [];

  @Input() ctrl_refno: string
  @Output() newItemEvent = new EventEmitter<any>();

  ngOnInit() {

    this.cs_type = [{ '_type': 'CUS' }, { '_type': 'SUP' }];
    this._ref_no = "1123118";

    // this._jvDetailSubscription = this.gljvService.getglJVDetails(this.ctrl_refno).subscribe(
    //   (_gljvDetails) => {
    //     this._jvDetailsData = _gljvDetails;
    //   },
    //   (err) => console.log(err)
    // );
    this.JVinitialize();

    this._glAccount_titleSubscription = this.gl_acct_title_service.getGLAccounts().subscribe(
      (_gl_acct_title) => {
        this._gl_acct_title_data = _gl_acct_title;
      },
      (err) => console.log(err)
    );

    this._jvAcctsSubscription = this.gl_acct_title_service.JVAccounts().subscribe(
      (_jvaccts_data) => {
        this._jvAcctsDataCodeOnly = _jvaccts_data;
        console.log(this._jvAcctsDataCodeOnly);
      },
      (err) => console.log(err)
    );

    /**  GRID TRANSACTION  */
    this.transactionsData = this.transactions.getAggregatedChanges(true);
    this.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.transactions.getAggregatedChanges(true);
    });

    /** this code is to initialize for new ENTRY */
    this._jv_gl_crud_details = new jvgl_CRUDdetail();
  }

  public get transactions() {
    return this.grdglDetails.transactions;
  }

  public get hasTransactions(): boolean {
    return this.grdglDetails.transactions.getAggregatedChanges(false).length > 0;
  }

  // selectionChange(evt, cell) {
  //   cell.value = evt.newSelection.map(el => el.acct_desc).toString();
  // }

  ngOnDestroy() {
    this._jvDetailSubscription.unsubscribe();
    this._jvAcctsSubscription.unsubscribe();
    this._glAccount_titleSubscription.unsubscribe();
  }

  /** Look Up Table for combo box from GRID */
  public singleSelection(event: IComboSelectionChangeEventArgs, cell) {
    // cell.value = event.newSelection.map(el)
    let _display_ = "";
    if (event.added.length) {
      event.newSelection = event.added;
      _display_ = event.displayText;
      //   this.acct_sel_value = event.newSelection[0];
    } else {
      event.newSelection = [];
    }
    // this.grdglDetails.updateCell(cell.newSelection.element.nativeElement.textContent.trim(), cell.rowData.ID, 'remarks');
    this.grdglDetails.updateCell(event.newSelection[0], parseInt(this.sel_row, 10), 'acct_code');
    this.getValueOfAccount(event.newSelection[0]);

  }

  editDone(event) {
    //const targetCell = event.cell as IgxGridCellComponent;
    console.log("onRowEdit");
    console.log(parseFloat(event.newValue));
    // let _newVal = "Advances - Others";
    // this.grdglDetails.updateCell(this.acct_sel_value, 2, 'acct_desc');
    // if (event.cellID.columnID == 2) {
    //   console.log(parseFloat(event.newValue));
    //   let _newVal = parseFloat(event.newValue);
    //   this.grdglDetails.updateCell(_newVal, event.rowID, 'acct_desc');
    // }
  }

  /** code for DROP-DOWN FUNCTION */
  public onSelection(e, c) {
    //this.grdglDetails.updateCell(e.newSelection.element.nativeElement.textContent.trim(), c.rowData.ID, 'acct_code');
    this.grdglDetails.updateCell(e.newSelection.element.nativeElement.textContent.trim(), parseInt(this.sel_row, 10), 'acct_code');
    this.grdglDetails.updateCell(e.newSelection.element.nativeElement.textContent.trim(), parseInt(this.sel_row, 10), 'remarks');
    this.getValueOfAccount(e.newSelection.element.nativeElement.textContent.trim());

    console.log(this.acct_by_desc);
    //   this.backgroundClasses = { ...this.backgroundClasses };
  }


  public select(evt, cell) {
    const val = this._jvAcctsDataCodeOnly[evt.newSelection.index].acct_code;
    cell.update(val);
    const val_desc = this._jvAcctsDataCodeOnly[evt.newSelection.index].acct_desc;

    this.grdglDetails.updateCell("test", cell.rowData.ID, 'acct_desc');
  }

  // public openDropDown() {
  //   if (this.dropDown.collapsed) {
  //     this.dropDown.open({
  //       modal: false,
  //       positionStrategy: new ConnectedPositioningStrategy({
  //         target: this.inputGroup.element.nativeElement
  //       })
  //     });
  //   }
  // }

  Updatecell() {
    const _row = parseInt(this.sel_row, 10);
    this.grdglDetails.updateCell(250, parseInt(this.sel_row, 10), 'cr_amt');
  }

  handleRowSelection(event) {
    const targetCell = event.cell as IgxGridCellComponent;

    // if  (!this.selection) {
  //  if (!this.addNewRow) {
      this.grdglDetails.selectRows([targetCell.row.rowID], true)
      console.log(this.grdglDetails.selectedRows());
      this.sel_row = this.grdglDetails.selectedRows();
  //  }
    //  if (!this.selection) {
    //   this.grdglDetails.selectRows([targetCell.row.rowID], true);
    // }
  }

  getValueOfAccount(acct_code: string) {
    this._jvbycodeSubscription = this.gl_acct_title_service.getGLAcctBycode(acct_code).subscribe(
      (_getJVbycode_) => {
        this.acct_by_desc = _getJVbycode_[0].acct_desc;
        this.for_acct_desc = _getJVbycode_[0].acct_desc;
        this.grdglDetails.updateCell(this.acct_by_desc, parseInt(this.sel_row, 10), 'acct_desc');
        console.log(this.acct_by_desc);
      },
      (err) => console.log(err)
    )
  }

  /** IG-GRID save CRUD FUNCTION */
  public saveCRUDgrid() {
    let addResult: { [id: number]: IGLJVdetails };

    this.gljvService
      .jvglCRUDdetails(this.grdglDetails.transactions.getAggregatedChanges(true))
      .subscribe(
        (res) => {
          if (res) {
            addResult = res;
            //    console.log(res);
          }
        },
        (err) => (this.errors = err),
        () => {
          // all done, commit transactions
          this.grdglDetails.transactions.commit(this._jvDetailsData);
          if (!addResult) {
            return;
          }
          // update added records IDs with ones generated from backend
          for (const id of Object.keys(addResult)) {
            const item = this._jvDetailsData.find(
              (x) => x.line_ctrl_no === parseInt(id, 10)
            );
            item.line_ctrl_no = addResult[id].drlineno;
          }
          this._jvDetailsData = [...this._jvDetailsData];
        }
      );
    this._jv_gl_crud_details = new jvgl_CRUDdetail();
    this.JVinitialize();
  }

  /** initialize the jv details upon loading */
  JVinitialize() {
    this._jvDetailSubscription = this.gljvService.getglJVDetails(this.ctrl_refno).subscribe(
      (_gljvDetails) => {
        this._jvDetailsData = _gljvDetails;
      },
      (err) => console.log(err)
    );
  }
  //** end of initialization  */

  public addRow() {
    //this.grdglDetails.addRow(this._jv_gl_crud_details)
    this.addNewRow = true;
    this.grdglDetails.addRow({
      line_ctrl_no: this.counter++,
      ref_no: this.ctrl_refno,
      source: "GLS",
      trans_code: "JV",
      line_no: 0,
      acct_code: this.for_acct_code,
      acct_desc: this.for_acct_desc,
      dr_amt: this._jv_gl_crud_details.dr_amt,
      cr_amt: this._jv_gl_crud_details.cr_amt,
      sl_type: this._jv_gl_crud_details.sl_type,
      sll_code: this._jv_gl_crud_details.sll_code,
      remarks: this._jv_gl_crud_details.remarks,
      cs_type: this._jv_gl_crud_details.cs_type,
      cs_code: this._jv_gl_crud_details.cs_code,
    })
    this.cancel();
  }

  public deleteRow(event, rowID) {
    this.grdglDetails.deleteRow(rowID);
  }

  public cancel() {
    this.dialog.close();
    this._jv_gl_crud_details = new jvgl_CRUDdetail();
  }
  /** Account Code LookUP for Account Description upon new transaction */
  public AddSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      //   this.acct_sel_value = event.newSelection[0];
      this.for_acct_code = event.newSelection[0]
      this.getValueOfAccount(this.for_acct_code);
      // this.for_acct_desc = this.acct_by_desc;
    } else {
      event.newSelection = [];
    }
    //   this.grdglDetails.updateCell(event.newSelection[0], parseInt(this.sel_row, 10), 'acct_code');

    this.acct_code.close();
    //   this.grdglDetails.updateCell(cell.newSelection.element.nativeElement.textContent.trim(), cell.rowData.ID, 'quantityPerUnit');

  }
  public cstypSelection(e) {
    console.log(e);
  }

  /** this for CS TYPE DROP DOWN */
  public selectcstype(e, cell) {
    const val = this.cs_type[e.newSelection.index]._type;
    cell.update(val);
  }
  public openDropDown() {
    if (this.dropDown_cstype.collapsed) {
      this.dropDown_cstype.open({
        modal: false,
        positionStrategy: new ConnectedPositioningStrategy({
          target: this.inputGroup.element.nativeElement
        })
      });
    }
  }

  TestSave(){
    
    this.newItemEvent.emit();
  }

}
