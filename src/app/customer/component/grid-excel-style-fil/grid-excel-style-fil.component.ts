import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxGridComponent } from 'igniteui-angular';
import { DATA } from '../grid-filtering/nwindData';

@Component({
  selector: 'app-grid-excel-style-fil',
  templateUrl: './grid-excel-style-fil.component.html',
  styleUrls: ['./grid-excel-style-fil.component.scss']
})
export class GridExcelStyleFilComponent implements OnInit {
  @ViewChild("grid1", { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;

  public data: any[];

  public density = "comfortable";
  public displayDensities;

  constructor() {
  }
  public ngOnInit(): void {
    this.data = DATA;
    this.displayDensities = [
      {
        label: "compact",
        selected: this.density === "compact",
        togglable: true
      },
      {
        label: "cosy",
        selected: this.density === "cosy",
        togglable: true
      },
      {
        label: "comfortable",
        selected: this.density === "comfortable",
        togglable: true
      }
    ];
  }

  public selectDensity(event) {
    this.density = this.displayDensities[event.index].label;
    this.grid1.displayDensity = this.displayDensities[event.index].label;
    this.grid1.reflow();
  }

  // public formatDate(val) {
  //     if (val !== "Select All") {
  //         return new Intl.DateTimeFormat("en-GB").format(val);
  //     } else {
  //         return val;
  //     }
  // }

  public formatDate(val) {
    if (val !== "Select All") {
      const offset = val.getTimezoneOffset()
      val = new Date(val.getTime() + (offset * 60 * 1000))
      return val.toISOString().replace(/T.*/, '').split('-').reverse().join('-');
    } else {
      return val;
    }
  }

  public formatCurrency(val: string) {
    return parseInt(val, 10).toFixed(2);
  }
}
