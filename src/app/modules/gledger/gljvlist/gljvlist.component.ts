import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GljvService } from '../../../service/gljv.service';
import { ICustomer } from '../../../shared/model/customer';
import { IGLJVheader } from '../../../shared/model/glJVHeader';
import {
  IComboSelectionChangeEventArgs,
  IgxComboComponent,
  IgxDatePickerComponent,
  IgxGridCellComponent,
  IgxGridComponent,
  IgxNumberSummaryOperand,
  IgxSummaryResult
} from "igniteui-angular";

import { GlJVState } from '../state/gledger.reducer';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fromGlJVActions from '../state/gledger.actions';
import { selectGLJV } from '../state/gledger.selectors';

@Component({
  selector: 'app-gljvlist',
  templateUrl: './gljvlist.component.html',
  styleUrls: ['./gljvlist.component.scss']
})
export class GljvlistComponent implements OnInit {
  @ViewChild('grdgljv', { read: IgxGridComponent, static: true })
  public grdgljv: IgxGridComponent;

  public glJVHeaderData: IGLJVheader[];
  public drHeaderData: ICustomer[];
  gljvhedader_data$: Observable<IGLJVheader[]>;
  // public customerdata: ICustomer[] = [];

  // customerdata$: Observable<ICustomer[]>;

  public gljvSubscription: Subscription;
  constructor(private _service: GljvService, private store: Store<GlJVState>, private router: Router) { }

  ngOnInit(): void {

    this.store.dispatch(fromGlJVActions.loadGledgers());
    this.loadGlJv();
    // this.gljvSubscription = this._service.getglJVHeader().subscribe(
    //   (_gljvdata) => {
    //     this.glJVHeaderData = _gljvdata;
    //     console.log(this.glJVHeaderData);
    //     //this.grid1.isLoading = false;
    //   });
    // (err) => console.log(err)
  }
  loadGlJv() {
    this.gljvhedader_data$ = this.store.pipe(select(selectGLJV));
  }


  handleSelection(event) {
  //  console.log(event);
    const targetCell = event.cell as IgxGridCellComponent;

    // if  (!this.selection) {
    //  if (!this.addNewRow) {
    this.grdgljv.selectRows([targetCell.row.rowID], true)
    //console.log(this.grdgljv.selectedRows());
    //this.sel_row = this.grdglDetails.selectedRows();
  }
  public formatDate(val: Date) {
    /// return new Intl.DateTimeFormat("en-US").format(val);
    var ndate = new Date(val).toLocaleDateString().slice(0,10);
    console.log(ndate);
    //console.log(new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date(val)));
    //console.log( new Date(ndate.toISOString().slice(0,10)));
    var xdate = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date(val))
    return ndate;
  }

  DateFormatter(val: any) {
    if (val) {
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var date = new Date(val);
      var dat = date.getDate();
      var month = monthNames[date.getMonth()];
      var year = date.getFullYear();
      if (dat < 10) {
        return "0" + date.getDate() + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear();
      }
      else {
        return date.getDate() + "-" + monthNames[date.getMonth()] + "-" + date.getFullYear();
      }
    }
    else {
      return "";
    }
  }

}
