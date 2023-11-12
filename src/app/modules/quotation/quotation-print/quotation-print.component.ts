import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TelerikReportViewerComponent } from '@progress/telerik-angular-report-viewer';
import { mapapi } from 'src/app/shared/iUrlpath';

const _PrintResoure = mapapi.PrintResource;

@Component({
  selector: 'app-quotation-print',
  templateUrl: './quotation-print.component.html',
  styleUrls: ['./quotation-print.component.scss']
})
export class QuotationPrintComponent implements OnInit {
  @ViewChild('viewer1', { static: false }) viewer: TelerikReportViewerComponent;

  @Input() reportSource;
  @Input() rsParam;

  public rs;
  //@Output() update_details: EventEmitter<string> = new EventEmitter<string>();

  public link_report_resource = _PrintResoure;
  constructor() { }

  title = 'Report Viewer';
  viewerContainerStyle = {
    position: 'relative',
    width: '800px',
    height: '450px',
    ['font-family']: 'Verdana, Arial,Effra'
  };


  ngOnInit() {
    const _branchname = JSON.parse(localStorage.getItem('BranchName'));
    if (_branchname == 'TWINBEE') {
      this.PrintTWINBEE();
    } else
      this.PrintTWINBEE();
  }

  /** print script of TELERIK REPORT */
  ready() { console.log('ready'); }
  viewerToolTipOpening(e: any, args: any) { console.log('viewerToolTipOpening ' + args.toolTip.text); }

  public PrintDRANS() {
    // this.rsParam = {
    //   report: 'ansquotationFINAL.trdp',
    //   parameters: { sqno: this.reportSource }
    // };
    //  this.viewer.refreshReport()
    this.viewer.setReportSource(this.rsParam);
  }

  public PrintTWINBEE() {
    // this.rsParam = {
    //   report: 'TWINBEE2021QUOTATION.trdp',
    //   parameters: { sqno: this.reportSource }
    // };
    //  this.viewer.refreshReport()
    this.rs = this.rsParam
    this.viewer.setReportSource(this.rs);
  }

}
