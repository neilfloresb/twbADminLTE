import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { QuoteService } from '../../../service/quote.service';
import { ConnectedPositioningStrategy, HorizontalAlignment, IgxColumnComponent, IgxDialogComponent, IgxDropDownComponent, IgxExcelExporterOptions, IgxExcelExporterService, IgxGridCellComponent, IgxGridComponent, IgxInputDirective, IgxInputGroupComponent, IgxNumberSummaryOperand, IgxSummaryResult, IgxTooltipTargetDirective, PositionSettings, RowEditPositionStrategy, slideInTop, slideOutBottom, Transaction, VerticalAlignment } from 'igniteui-angular';
import { from, Subscription } from 'rxjs';
import { IQuoteDTL } from '../../../shared/model/quotation';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { useAnimation } from '@angular/animations';
import { JobOrder } from 'src/app/shared/model/joborder';
import { JobOrderList } from '../../../shared/model/joborder';
import { mapapi } from 'src/app/shared/iUrlpath';
import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';

const _PrintResoure = mapapi.PrintResource;

@Component({
  selector: 'app-create-joborder',
  templateUrl: './create-joborder.component.html',
  styleUrls: ['./create-joborder.component.scss']
})
export class CreateJoborderComponent implements OnInit, OnDestroy {

  @ViewChild('viewer1', { static: false }) viewer: TelerikReportViewerComponent;

  @ViewChild('gridforJO', { read: IgxGridComponent, static: true })
  public gridforJO: IgxGridComponent;

  @ViewChild('joPrint', { read: IgxGridComponent, static: true })
  public joPrint: IgxGridComponent;

  @ViewChild('alert', { read: IgxDialogComponent, static: true })
  public alert: IgxDialogComponent;

  @ViewChild('viewPrint', { read: IgxDialogComponent, static: true })
  public viewPrint: IgxDialogComponent;

  @ViewChild('dialogPrint', { read: IgxDialogComponent, static: true })
  public dialogPrint: IgxDialogComponent;


  quoteDtlSubscription: Subscription;
  quoteDtlData: IQuoteDTL[];
  public JOCurrentSeriesno: string;
  public jotoprint: string;

  public positionSettings: PositionSettings = {
    openAnimation: useAnimation(slideInTop, { params: { duration: '1000ms' } }),
    closeAnimation: useAnimation(slideOutBottom, { params: { duration: '1000ms' } }),
    horizontalDirection: HorizontalAlignment.Center,
    verticalDirection: VerticalAlignment.Middle,
    horizontalStartPoint: HorizontalAlignment.Center,
    verticalStartPoint: VerticalAlignment.Middle,
    minSize: { height: 100, width: 100 }
  };

  public exportData = [];

  joborderData: JobOrder;
  current_sqno: string;
  public selection = true;
  private added = 0;

  public dataselected = [];
  public JoOrderListdata: JobOrderList[];

  public selectedRowsSum: number = 0;

  JOSubscription: Subscription;
  joS: boolean =false;
  JOlistSubscription: Subscription;
  joL: boolean = false;


  linkreport: string = _PrintResoure;
  title = 'Job Order Print Preview';
  viewerContainerStyle = {
    position: 'relative',
    width: '850px',
    height: '500px',
    ['font-family']: 'Verdana, Arial,Effra'
  };
  _entity;
  public rs;

  constructor(private quoteDtl: QuoteService, private route: ActivatedRoute, private excelExportService: IgxExcelExporterService) { }

  ngOnInit(): void {

    this.current_sqno = this.route.snapshot.paramMap.get('id');
    this._entity = JSON.parse(localStorage.getItem('entity'));

    this.quoteDtlSubscription = this.quoteDtl.getQuoteDetailsbySqnoforJO(this.current_sqno).subscribe(
      (_resQuotedtl) => {
        this.quoteDtlData = _resQuotedtl;

      }
    )
  }

  handleRowSelection(event) {
    const targetCell = event.cell as IgxGridCellComponent;
    //  let sam = event.row.rowData['desc'];
    // console.log(selectedRowData);

    // if (event.newSelection.length < event.oldSelection.length) {
    //   // removing element
    //   this.selectedRowsSum -= targetCell.row.rowData['qty_order'];
    // } else {
    //   // adds element
    //   this.selectedRowsSum += targetCell.row.rowData['qty_order'];
    // }
  }

  handlePrintSelection(event){
   const targetPrintCell = event.cell as IgxGridCellComponent;

    this.joPrint.selectRows([targetPrintCell.row.rowID], true);
    console.log(targetPrintCell.row.rowData['joborderno']);
    this.jotoprint = targetPrintCell.row.rowData['joborderno'];
  }

  initColumns(column: IgxColumnComponent) {
    if (column.field === "qty_order") {
      //   column.
      //  console.log("here!");
      // column.formatter = (date => {
      //   return formatDate(date, 'MM-dd-yyyy', 'en-US')
      // })
    }
  }

  handleSelection(event) {
    const targetCell = event.cell;
    const currentSelection = this.gridforJO.selectedRows();
    let srcname$ = from(currentSelection);
    let datas = this.gridforJO.selectRows([targetCell.row.rowData]);
    //console.log(targetCell.rowData);

    // console.log(event);
    // srcname$.pipe(map(data => {
    //   return data
    // }))
    //   .subscribe(data => { console.log('new data... ' + data) })
    // if (event.newSelection.length < event.oldSelection.length) {
    //   // removing element
    //   this.selectedRowsSum -= targetCell.row.rowData['qty_order'];
    // } else {
    //   // adds element
    //   this.selectedRowsSum += targetCell.row.rowData['qty_order'];
    // }


    // console.log(currentSelection);
    // if (!this.selection) {
    //   this.gridforJO.deselectAllRows();
    //   this.gridforJO.selectRows([targetCell.row.rowID]);
    // }
    // const targetCell = event.cell as IgxGridCellComponent;
    // this.gridforJO.selectRows([targetCell.row.rowID], true)
  }

  ngOnDestroy() {
    this.quoteDtlSubscription.unsubscribe();
    if (this.joS) {
    this.JOSubscription.unsubscribe();
    }
    if (this.joL){
    this.JOlistSubscription.unsubscribe();
    }
  }

  public getSelectedrows() {
    let seletedRows = this.gridforJO.selectedRows();
    //    let cell = this.gridforJO.cellSelection;
    //    console.log(this.gridforJO.selectedRows());
    // for (let value of seletedRows) {
    //   console.log(value);
    if (seletedRows.length != 0) {
      this.JOSubscription = this.quoteDtl.getJobOrderSeriesno().subscribe(
        (res) => {
          console.log('jo no.:' + res[0].jo_no);
          this.JOCurrentSeriesno = res[0].jo_no;

          for (let index in seletedRows) {
            let counter: number = parseInt(index);

            this.joborderData = {
              jono: this.JOCurrentSeriesno,
              sqno: this.current_sqno,
              seqlineno: seletedRows[index]
            };

            this.joS = true;
            //  console.log(index);    //Prints indexes
            // console.log(this.gridforJO.getRowByIndex(counter).rowData);
            // console.log(seletedRows[index]);   //Prints values
            console.log(this.joborderData);

            this.quoteDtl.GenerateJobOrder(this.joborderData).subscribe(
              () => {

              }
            ),
              (err: any) => console.log(err)
          };
        }
      );

    } else {
      this.alert.open();
    };
  }

 public PrintJoborder(event) {
    console.log(event);
    if (this._entity == "TWINBEE") {
      this.dialogPrint.open();
      this.rs = {
        report: 'JOBORDERtwinbee.trdp',
        parameters: { jono: this.jotoprint }
      };
      this.viewer.setReportSource(this.rs);
    } else if (this._entity == "ANS") {
      this.dialogPrint.open();
      this.rs = {
        report: 'JOBORDERans.trdp',
        parameters: { jono: this.jotoprint }
      };
      this.viewer.setReportSource(this.rs);
    };

   // this.viewer.refreshReport()
    /*** SET REPORTSOURCE is import to Refresh Report */
  //this.viewer.setReportSource(this.rs);
  }

  public cancel() {
    this.dialogPrint.close();
    this.viewer.clearReportSource();
  }


  log(args) {
    console.log(args);
  }

  ViewforPrintJo() {
    this.JOlistSubscription = this.quoteDtl.JobOrderList(this.current_sqno).subscribe(
      (result) => {
        console.log(result);
        this.JoOrderListdata = result;
        this.joL = true;
        this.viewPrint.open();
      }
    ),
      (err: any) => console.log(err);
  }

  /** get the Job Order Series No */
  getJObOrderSeries() {
    const JOSeriesno = this.quoteDtl.getJobOrderSeriesno();
    this.quoteDtl.getJobOrderSeriesno()
      .pipe(
        map(idno => idno[0]),
        take(1)
      ).subscribe(res => {
        this.JOCurrentSeriesno = res.jo_no;
        //     console.log(this.quoteCurrentSeriesno);
        //this.mapCurrentValues();
      })
  }



  public ExportSelected(event) {
    console.log(event);
    let selectedRows = this.gridforJO.selectedRows();
    //const rowData_ = {};
    for (let index in selectedRows) {
      let counter: number = parseInt(index);
      //const newobj = Object.assign({}, rowData);
      let rowData_ = this.gridforJO.getRowByIndex(counter).rowData;
      //  let rowData = targetCell[rowIndex].rowData;
      this.exportData.push(rowData_);
    }
    console.log(this.exportData);
    this.excelExportService.exportData(this.exportData, new IgxExcelExporterOptions("ExportedDataFile"));
    this.exportData = [];
  }
}
