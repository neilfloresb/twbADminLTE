import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';
import { IgxColumnComponent, IgxDialogComponent, IgxGridCellComponent, IgxGridComponent, IgxToastComponent, IgxToastPosition } from 'igniteui-angular';
import { timeStamp } from 'node:console';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuoteService } from 'src/app/service/quote.service';
import { mapapi } from 'src/app/shared/iUrlpath';


const _PrintResoure = mapapi.PrintResource;
@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent implements OnInit {
  @ViewChild('viewer1', { static: false }) viewer: TelerikReportViewerComponent;
  @ViewChild('dialogPrint', { read: IgxDialogComponent, static: true })
  public dialogPrint: IgxDialogComponent;

  @ViewChild('dialogConfirm', { read: IgxDialogComponent, static: true })
  public dialogConfirm: IgxDialogComponent;

  @ViewChild("toast", { read: IgxToastComponent, static: true })
  public toast: IgxToastComponent;

  @ViewChild("toastConfirm", { read: IgxToastComponent, static: true })
  public toastConfirm: IgxToastComponent;
  // @Input()
  toastPosition: IgxToastPosition = IgxToastPosition.Middle;

  eventsSubject: Subject<void> = new Subject<void>();

  @ViewChild('grid1', { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;

  constructor(private _quote: QuoteService, private _router: Router) { }

  quoteStatus: string;
  quoteListing;
  public confirm_sqno: string;
  public rs;

  linkreport: string = _PrintResoure;
  title = 'Report Viewer';
  viewerContainerStyle = {
    position: 'relative',
    width: '850px',
    height: '500px',
    ['font-family']: 'Verdana, Arial,Effra'
  };
  _entity;

  ngOnInit(): void {
    this._entity = JSON.parse(localStorage.getItem('entity'));
    this.getQuotatiionLISTING();
  }


  getQuotatiionLISTING() {
    //const quoteCurrentSeriesno = this._quote.getQUATATIONhdr();
    // twb@B332019

    const tmpranch = JSON.parse(localStorage.getItem('BranchName'));
    const tempuser = JSON.parse(localStorage.getItem('userName'));

    this._quote.getQUATATIONhdr(tmpranch, tempuser)
      .pipe(
        map(val => {
          return val
        }))
      .subscribe(res => {
        //    console.log(res);
        this.quoteListing = res;
      })
  }

  handleSelection(event) {
    const targetCell = event.cell as IgxGridCellComponent;
    //   console.log(event)
    this.grid1.selectRows([targetCell.row.rowID], true)
    // = targetCell.rowData["status"].trim();
    //console.log(this.quoteStatus);
  }

  initColumns(column: IgxColumnComponent) {
    if (column.field === "sqdate") {
      //  console.log("here!");
      column.formatter = (date => {
        return formatDate(date, 'MM-dd-yyyy', 'en-US')
      })
    }
  }

  // public CustomformatDate(val: Date) {
  //   /// return new Intl.DateTimeFormat("en-US").format(val);
  //   var ndate = new Date(val).toLocaleDateString().slice(0, 10);
  //   //    console.log(ndate);
  //   //console.log(new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date(val)));
  //   //console.log( new Date(ndate.toISOString().slice(0,10)));
  // //  var xdate = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date(val))
  //   return ndate;
  // }

  /*** PRINT SCRIPT  */

  public cancel() {
    this.dialogPrint.close();
    this.viewer.clearReportSource();
  }


  public Printevent(event, rowID) {
    // this.dialogPrint.open();
    // this.rs = {
    //   report: 'TWINBEE2021QUOTATION.trdp',
    //   parameters: { sqno: rowID }
    // };

    if (this._entity == "TWINBEE") {
      this.dialogPrint.open();
      this.rs = {
        report: 'TWINBEE2021QUOTATION.trdp',
        parameters: { sqno: rowID }
      };
    } else if (this._entity == "ANS") {
      this.dialogPrint.open();
      this.rs = {
        report: 'ansquotationFINAL.trdp',
        parameters: { sqno: rowID }
      };
    };

    this.viewer.refreshReport()
    /*** SET REPORTSOURCE is import to Refresh Report */
    this.viewer.setReportSource(this.rs);
  }

  public Editevent(event, rowID) {
    this._router.navigate(['/home/quotation/edit', rowID.trim()]);
  }

  public closeDialog() {

    this.dialogConfirm.close();
    // console.log(evt);
  }

  public handleRowSelection(event) {
    console.log(event);
  }
  //** Open Dialog Windows of Confirm */
  public Confirmevent(event, rowID, datas) {
    // var index = this.grid1.getb
    //const targetCell = //this.grid1.cell as IgxGridCellComponent;
    const myCell = this.grid1.getCellByColumn(0, "status");
    //  console.log(this.grid1);
    console.log(datas.status);
    this.quoteStatus = datas.status.trim();

    // const targetCell = event.cell as IgxGridCellComponent;
    if (this.quoteStatus != "CONFIRMED") {
      this.confirm_sqno = rowID.trim();
      this.dialogConfirm.open();
    } else {
      this.quoteStatus = "";
    }
  }
  //** end of open dialog */

  public ConfirmQuotation() {
    this.eventsSubject.next();
    this.dialogConfirm.close();
  }
  Viewevent(event, rowID) {
    this.toast.show();
  }

  GenAndViewforJO(event, rowID, datas) {
    this.quoteStatus = datas.status.trim();
    console.log(this.quoteStatus);
    if (this.quoteStatus == "CONFIRMED") {
      this._router.navigate(['/home/quotation/genjo', rowID.trim()]);
    } else {
      this.quoteStatus = "";
      this.toastConfirm.show();
    }
  }

  public CopyQuote(event, rowID) {
    this._quote.QuotationCopy(rowID).subscribe(
      () => {
        this.getQuotatiionLISTING();
      }
    ),
      (err: any) => console.log(err)
    // this.QuoteService. .CreateQuoteHeader(this._quote.quoteForm).subscribe(
    //   () => {
    //  //   this.router.navigate(['home/quotation/edit/' + this.quoteCurrentSeriesno]);
    //   }
    // ),
    //    (err: any) => console.log(err)
  }

  //** SHOW MESSAGE and REFRESH */
  public ConfirmSuccess() {
    this.toast.show();
    this.getQuotatiionLISTING();
  }
}
