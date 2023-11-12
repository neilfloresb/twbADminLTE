import { Component, OnInit, ViewChild } from '@angular/core';
import { DataType, IFilteringOperation, IgxColumnComponent, IgxDateFilteringOperand, IgxGridComponent, IgxNumberFilteringOperand, IgxStringFilteringOperand } from 'igniteui-angular';
import { DATA } from '../grid-filtering/nwindData';

@Component({
  selector: 'app-grid-filtering',
  templateUrl: './grid-filtering.component.html',
  styleUrls: ['./grid-filtering.component.scss']
})
export class GridFilteringComponent implements OnInit {

  @ViewChild("grid1", { read: IgxGridComponent })
  public grid1: IgxGridComponent;
  public DateFormatter = DateFormatter;

  public customFilter = StringDateFilteringOperand.instance();

  public data: any[];

  constructor() {
  }
  public ngOnInit(): void {
    this.data = DATA;
  }

  public formatDate(val: Date) {
    return new Intl.DateTimeFormat("en-US").format(val);
  }

  public formatCurrency(val: string) {
    return parseInt(val, 10).toFixed(2);
  }

  public onInput(input: any, column: IgxColumnComponent) {
    let operand = null;
    if (column.field = "OrderDate") {
      operand = this.customFilter.condition("Custom");
    }
    else {
      switch (column.dataType) {
        case DataType.Number:
          operand = IgxNumberFilteringOperand.instance().condition("equals");
          break;
        case DataType.Date:
          operand = IgxDateFilteringOperand.instance().condition("equals");
          break;
        default:
          operand = IgxStringFilteringOperand.instance().condition("contains");
      }
    }
    this.grid1.filter(column.field, this.transformValue(input.value, column), operand, column.filteringIgnoreCase);
  }

  public clearInput(input: any, column: any) {
    input.value = null;
    this.grid1.clearFilter(column.field);
  }

  public onDateSelected(event, column: IgxColumnComponent) {
    this.grid1.filter(column.field, event, IgxDateFilteringOperand.instance().condition("equals"),
      column.filteringIgnoreCase);
  }

  public openDatePicker(openDialog: () => void) {
    openDialog();
  }

  private transformValue(value: any, column: IgxColumnComponent): any {
    if (column.dataType === DataType.Number) {
      value = parseFloat(value);
    } else if (column.dataType === DataType.Date) {
      value = new Date(value);
    }
    return value;
  }
}

export class StringDateFilteringOperand extends IgxStringFilteringOperand {

  private constructor() {
    super();
    const customOperations: IFilteringOperation =
    {
      iconName: "contains",
      isUnary: false,
      logic: (target: string, searchVal: string, ignoreCase?: boolean) => {
        const val = DateFormatter(target);
        return val.indexOf(searchVal) !== -1;
      },
      name: "Custom"
    };

    this.append(customOperations);
  }

  public static instance(): StringDateFilteringOperand {
    return new this();
  }
}



export function DateFormatter(val: any) {
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


