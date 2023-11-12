import { Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { ConnectedPositioningStrategy, IgxDialogComponent, IgxDropDownComponent, IgxGridCellComponent, IgxGridComponent, IgxInputDirective, IgxInputGroupComponent, IgxNumberSummaryOperand, IgxSummaryResult, IgxTooltipTargetDirective, Transaction } from 'igniteui-angular';
import { IQuoteDTL } from '../../../shared/model/quotation';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteService } from '../../../service/quote.service';
import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';
import { mapapi } from 'src/app/shared/iUrlpath';
import { IQuoteDTLCRUD } from '../../../shared/model/quotation';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { BooktypeService, QuotationService } from 'src/app/service/booktype.service';
import { SERvice, UMeasure } from '../../../shared/model/service';


const _PrintResoure = mapapi.PrintResource;

class VatSummary {
  public operate(data?: any[]): IgxSummaryResult[] {
    const result = [];
    result.push({
      key: "total",
      label: "T-Vat:",
      summaryResult: IgxNumberSummaryOperand.sum(data)
    });
    return result;
  }
}

class totalSummary {
  public operate(data?: any[]): IgxSummaryResult[] {
    const result = [];
    result.push({
      key: "total",
      label: "TotAmt:",
      summaryResult: IgxNumberSummaryOperand.sum(data)
    });
    return result;
  }
}

class SubtotalSummary {
  public operate(data?: any[]): IgxSummaryResult[] {
    const result = [];
    result.push({
      key: "total",
      label: "Sum",
      summaryResult: IgxNumberSummaryOperand.sum(data)
    });
    return result;
  }
}
@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.component.html',
  styleUrls: ['./quotation-detail.component.scss']
})
export class QuotationDetailComponent implements OnInit {
  @ViewChild('quotegridDetails', { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;

  @ViewChild('dialogPrint', { read: IgxDialogComponent, static: true })
  public dialogPrint: IgxDialogComponent;
  @ViewChild("dialogAdd", { read: IgxDialogComponent, static: true })
  public dialogAdd: IgxDialogComponent;

  @ViewChild('viewer1', { static: false }) viewer: TelerikReportViewerComponent;
  @ViewChild("dropDown_cstype") public dropDown_cstype: IgxDropDownComponent;
  @ViewChild("dropDown_service") public dropDown_service: IgxDropDownComponent;
  @ViewChild("inputUM") public inputUM: IgxInputGroupComponent;
  @ViewChild("inputSVR") public inputSVR: IgxInputGroupComponent;
  @ViewChild('qty', { read: IgxInputDirective })
  public qty: IgxInputDirective;
  @ViewChild('unitcost', { read: IgxInputDirective })
  public unitcost: IgxInputDirective;
  @ViewChild('target', { static: true }) public tooltipTarget: IgxTooltipTargetDirective;

  public SubtotalSummary = SubtotalSummary;
  public totalSummary = totalSummary;
  public VatSummary = VatSummary;
  // public _vattype;
  public curSelectedVAT;
  public current_sqno;

  private _tmpDetailsqno;
  @Input()
  set tmpDetailsqno(val: string) {
    //  console.log('from' + this._tmpDetailsqno + ' to' + val);
    this._tmpDetailsqno = val;
  }
  get tmpDetailsqno(): string {
    return this._tmpDetailsqno;
  }

  private _tmpVattype;
  @Input()
  set tmpVattype(val: string) {
    // console.log('fromtype' + this._tmpVattype + ' to' + val);
    this._tmpVattype = val;
    this.getQuotationDETAILS();
  }
  get tmpVattype(): string {
    return this._tmpVattype;
  }

  @Output() SaveHdrEmit = new EventEmitter<any>();

  public link_report_resource = _PrintResoure;
  public rsParam;
  public transactionsData: Transaction[] = [];

  private _quoteDtlDATA2;
  @Input()
  set _quotationDetail_data(val: IQuoteDTL[]) {
    this._quoteDtlDATA2 = val;
  }
  get _quotationDetail_data(): IQuoteDTL[] {
    return this._quoteDtlDATA2;
  }
  //public _quotationDetail_data: IQuoteDTL[];

  public valueqty = 0;

  public value = 324100;
  public displayFormat = new DisplayFormatPipe();
  public inputFormat = new InputFormatPipe();
  public germanLocale = new GermanLocale();
  transformValueCurrency: any;
  transformValue: any;

  public errors: any[];

  public quoteAddDetail;
  unitmeasure;
  //servicesList: SERvice[];
  servicesListed: SERvice[];
  umeasuresListed: UMeasure[];
  public cs_type: { um: string }[];
  cur_selectedServices;
  cur_selectedUm;


  constructor(private route: ActivatedRoute, private _quote: QuoteService, private mgaSERVICE: QuotationService, private services_: BooktypeService, private cp: CurrencyPipe, private decimalPipe: DecimalPipe) {
    this.transformValueCurrency = cp.transform(this.value, 'USD', 'symbol', '1.2-2');
  //  this.transformValue = cp.transform()
  }

  title = 'Report Viewer';
  viewerContainerStyle = {
    position: 'relative',
    width: '800px',
    height: '450px',
    ['font-family']: 'Verdana, Arial,Effra'
  };

  _entity;

  private _hasConfirmed;
  @Input()
  set hasConfirmed(val: boolean) {
    this._hasConfirmed = val;
  }
  get hasConfirmed(): boolean {
    return this._hasConfirmed;
  }
  private _hasDisable;
  @Input()
  set hasDisable(val: boolean) {
    this._hasDisable = val;
  }
  get hasDisable(): boolean {
    return this._hasDisable;
  }

  ready() { console.log('ready'); }
  viewerToolTipOpening(e: any, args: any) { console.log('viewerToolTipOpening ' + args.toolTip.text); }

  ngOnInit(): void {

    //this.hasConfirmed = false;

    this._entity = JSON.parse(localStorage.getItem('entity'));
    this.unitmeasure = this.mgaSERVICE.unitofmeasure;
    // console.log(this.unitmeasure);
    this.getServiceList();
    this.getUMEASUREList();

    this.getQuotationDETAILS();

    /**  GRID TRANSACTION  */
    this.transactionsData = this.transactions.getAggregatedChanges(true);
    this.transactions.onStateUpdate.subscribe(() => {
      this.transactionsData = this.transactions.getAggregatedChanges(true);
    });

    /** Quotation Details Initial for new entry */

    this.quoteAddDetail = new IQuoteDTLCRUD();
  }

  public get transactions() {
    return this.grid1.transactions;
  }

  public get hasTransactions(): boolean {
    return this.grid1.transactions.getAggregatedChanges(false).length > 0;
  }

  handleSelection(event) {
    const targetCell = event.cell as IgxGridCellComponent;
    //   console.log(event)
    this.grid1.selectRows([targetCell.row.rowID], true)
  }

  /** LOAD SERVICES LISTING */
  getServiceList() {
    this.services_.getSERVICElist()
      .pipe(
        map(val => {
          return val
        })
      ).subscribe(result => {
        this.servicesListed = result;
        //     console.log(this.servicesListed);
      })
  }

  /** LOAD SERVICES LISTING */
  getUMEASUREList() {
    this.services_.getUNITofMEASURE()
      .pipe(
        map(val => {
          return val
        })
      ).subscribe(result => {
        this.umeasuresListed = result;
        //   console.log(this.umeasuresListed);
      })
  }


  /*** VALIDATE INPUTS */
  public isFocused: boolean = false;
  validate(unitcost, snackbar) {
    if (unitcost.value == '' || unitcost.value == 0 || unitcost.value < 0) {
      this.notify(snackbar, 'Please input Valid UnitCost...', unitcost);
      this.unitcost.focus();
    };
    //  else{
    //   this.unitcost.value = parseFloat(unitcost.value) * 4;
    //   this.quoteAddDetail.unitcost = this.cp.transform(parseFloat(this.unitcost.value), 'USD', 'symbol','1.2-2');
    //  // console.log(this.transformValueCurrency = this.cp.transform(parseFloat(this.unitcost.value), 'USD', 'symbol', '1.2-2'));
    //   console.log(this.quoteAddDetail.unitcost);
    // }
  }

  validateqty(qty, snackbar) {
    if (qty.value == '' || qty.value == 0 || qty.value < 0) {
      this.notify(snackbar, 'Please input Valid Quantity Order...', qty);
      this.qty.focus();
    }
  }

  validateUM(um, snackbar) {
    if (um.value == '' || um.value == undefined) {
      this.notify(snackbar, 'Please Select valid Unit Of Measure...', um);
    }
  }

  validateService(serviceID, snackbar) {
    //this.dropdown_cstype.selectedItem?.value.um
    serviceID = this.cur_selectedServices;
    if (serviceID.value == '' || serviceID.value == null) {
      this.notify(snackbar, 'Please Select Valid SERVICE...', serviceID);
      //   this.isFocused = true;
    } else {
    this.quoteAddDetail.serviceID = this.cur_selectedServices;
    }
    //this.isFocused = false;
  }

  notify(snackbar, message, input) {
    snackbar.message = message;
    snackbar.actionText = 'Dismiss';
    snackbar.show();
  }
  /*** */
  getQuotationDETAILS() {
    this._quote.getQuotationDetailByNO(this.tmpDetailsqno)
      .pipe(
        map(val => {
          return val
        })
      ).subscribe(result => {

        this._quotationDetail_data = result;
        //    console.log(this._quotationDetail_data);
        this.PrintPreview();
      })
  }

  public deleteRow(event, rowID) {
    this.grid1.deleteRow(rowID);
  }

  QuoteConfirm() {

  }

  public saveDetail() {
    let addResult: { [id: number]: IQuoteDTL };

    this._quote
      .QuoteDtlsCRUD(this.grid1.transactions.getAggregatedChanges(true))
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
          this.grid1.transactions.commit(this._quotationDetail_data);
          if (!addResult) {
            return;
          }
          // update added records IDs with ones generated from backend
          for (const id of Object.keys(addResult)) {
            const item = this._quotationDetail_data.find(
              (x) => x.seqlineno === parseInt(id, 10)
            );
            item.seqlineno = addResult[id].drlineno;
          }
          this._quotationDetail_data = [...this._quotationDetail_data];
        }
      );
    this.quoteAddDetail = new IQuoteDTLCRUD();
    //   this.JVinitialize();
    this.SaveHdrEmit.emit();
  }

  public PrintPreview() {
    if (this._entity == "TWINBEE") {
      this.rsParam = {
        report: 'TWINBEE2021QUOTATION.trdp',
        parameters: { sqno: this.tmpDetailsqno }
      };
    } else if (this._entity == "ANS") {
      this.rsParam = {
        report: 'ansquotationFINAL.trdp',
        parameters: { sqno: this.tmpDetailsqno }
      };
    };
 //   this.viewer.setReportSource(this.rsParam);

  }

  public Printevent() {
    //this.current_sqno;

    if (this._entity == "TWINBEE") {
      this.dialogPrint.open();
      this.rsParam = {
        report: 'TWINBEE2021QUOTATION.trdp',
        parameters: { sqno: this.tmpDetailsqno }
      };
    } else if (this._entity == "ANS") {
      this.dialogPrint.open();
      this.rsParam = {
        report: 'ansquotationFINAL.trdp',
        parameters: { sqno: this.tmpDetailsqno }
      };
    };
    this.viewer.setReportSource(this.rsParam);
  }

  public cancel() {
    this.dialogPrint.close();
    //this.viewer.clearReportSource();
  }

  public addNewRow: boolean = false;
  public counter: number = 1
  unitpriceT: any;
  public _total: number = 0;
  public _vat: number = 0;

  public addRow() {
    // this.unitpriceT = this.cp.transform(this.quoteAddDetail.unitcost, 'P', 'symbol', '1.2-2')
    if (this.tmpVattype == 'INCLUSIVE') {
      this._vat = ((parseFloat(this.quoteAddDetail.unitcost) * parseFloat(this.quoteAddDetail.qty_order)) * 1.12);
      this._total = (parseFloat(this.quoteAddDetail.unitcost) * parseFloat(this.quoteAddDetail.qty_order)) + this._vat;
    } else {
      this._vat = 0;
      this._total = (parseFloat(this.quoteAddDetail.unitcost) * parseFloat(this.quoteAddDetail.qty_order));
    };


    //this.tmpVattype
    let _mat = this.quoteAddDetail.materials;
    let _fin = this.quoteAddDetail.finishing;

    if (_fin == null || _fin == undefined) {
      _fin = '';
    };

    if (_mat == null || _mat == undefined) {
      _mat == ''
    }

    this.grid1.addRow({
      seqlineno: this.counter++,
      sqno: this.tmpDetailsqno,
      desc: this.quoteAddDetail.desc,
      size: this.quoteAddDetail.size,
      qty_order: this.quoteAddDetail.qty_order,
      um: this.cur_selectedUm,
      unitcost: this.quoteAddDetail.unitcost,
      vatamt: this._vat,
      serviceID: this.cur_selectedServices,
      subtotal: this.quoteAddDetail.unitcost * this.quoteAddDetail.qty_order,
      total: this._total,
      materials: _mat,
      finishing: _fin,
    })
    //   console.log(this.grid1.addRow);
    this.closeadd();
  }

  public closeadd() {
    this.dialogAdd.close();
    this.quoteAddDetail = new IQuoteDTLCRUD();
  }

  onSelectionService(evnt) {
    const _sel_ = evnt.newSelection.value.serviceID;
    this.cur_selectedServices = _sel_;
    console.log(this.cur_selectedServices);
  }
  onSelectionUM(event) {
    const _sel_ = event.newSelection.value.um;
    this.cur_selectedUm = _sel_;
    console.log(this.cur_selectedUm);
  }

  /** this for CS TYPE DROP DOWN of GRID*/
  public selectUNITmeasure(e, cell) {
    const val = this.umeasuresListed[e.newSelection.index].um;
    cell.update(val);
  }

  public openDropDown() {
    if (this.dropDown_cstype.collapsed) {
      this.dropDown_cstype.open({
        modal: false,
        positionStrategy: new ConnectedPositioningStrategy({
          target: this.inputUM.element.nativeElement
        })
      });
    }
  }

  /** this for SERVICE TYPE DROP DOWN of GRID*/
  public selectService(e, cell) {
    const val = this.servicesListed[e.newSelection.index].serviceID;
    cell.update(val);
  }

  public openDropDown2() {
    if (this.dropDown_cstype.collapsed) {
      this.dropDown_cstype.open({
        modal: false,
        positionStrategy: new ConnectedPositioningStrategy({
          target: this.inputSVR.element.nativeElement
        })
      });
    }
  }
}

@Pipe({ name: "displayFormat" })
export class DisplayFormatPipe implements PipeTransform {
  public transform(value: any): string {
    return value + " %";
  }
}

@Pipe({ name: "inputFormat" })
export class InputFormatPipe implements PipeTransform {
  public transform(value: any): string {
    return value;
  }
}

@Pipe({ name: "germanLocale" })
export class GermanLocale implements PipeTransform {
  public transform(value: any): number {
    return value.toFixed(2).replace(/[.,]00$/, "");
    //return value.toLocaleString("de-DE");
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
