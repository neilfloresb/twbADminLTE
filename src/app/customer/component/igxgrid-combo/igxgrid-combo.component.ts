import { Component, HostListener, OnInit, ViewChild, NgZone } from '@angular/core';
import { athletesData } from "./data";
import { DATA } from "./customer";
import { FilteringExpressionsTree, FilteringLogic, IComboSelectionChangeEventArgs, IgxComboComponent, IgxGridComponent, IgxNumberFilteringOperand, IgxNumberSummaryOperand, IgxStringFilteringOperand, IgxSummaryResult } from 'igniteui-angular';

@Component({
  selector: 'app-igxgrid-combo',
  templateUrl: './igxgrid-combo.component.html',
  styleUrls: ['./igxgrid-combo.component.scss']
})
export class IgxgridComboComponent implements OnInit {
  @ViewChild("grid", { static: true }) public grid: IgxGridComponent;
  public data: any[];
  public companies;
  public backgroundClasses = {
    myBackground: (rowData: any, columnKey: string) => {
      return rowData.CompanyName == "Alfreds Futterkiste";
    }
  };

  public ngOnInit() {
    this.companies = new Set();
    this.data = DATA.map(row => {
      this.companies.add(row.CompanyName);
      return { ...row, Date: new Date() }
    });
  }

  public onSelection(e, c) {
    this.grid.updateCell(e.newSelection.element.nativeElement.textContent.trim(), c.rowData.ID, 'CompanyName');
    this.grid.updateCell(e.newSelection.element.nativeElement.textContent.trim(), c.rowData.ID, 'Comment');
    this.backgroundClasses = { ...this.backgroundClasses };
  }

  editDone(event) {
    console.log(event);
  }
}
