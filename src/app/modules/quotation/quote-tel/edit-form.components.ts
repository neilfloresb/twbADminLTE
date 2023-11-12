import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Product } from '../quote-tel/Product';

@Component({
  selector: 'kendo-grid-edit-form',
  styles: [
    `
            input[type='text'] {
                width: 100%;
            }
            .k-inline-checkbox {
                display: inline-flex;
            }
        `
  ],
  template: `
        <kendo-dialog *ngIf="active" [width]="300" [height]="450" (close)="closeForm()">
            <kendo-dialog-titlebar>
                {{ isNew ? 'Add new product' : 'Edit product' }}
            </kendo-dialog-titlebar>

            <form novalidate class="k-form" [formGroup]="editForm">
                <kendo-formfield>
                    <kendo-label [for]="ProductName" text="Product name"></kendo-label>
                    <input formControlName="ProductName" kendoTextBox #ProductName required />

                    <kendo-formhint>Type product name</kendo-formhint>
                    <kendo-formerror>Error: Product name is required</kendo-formerror>
                </kendo-formfield>

                <kendo-formfield>
                    <kendo-label [for]="UnitPrice" text="Unit price"></kendo-label>
                    <kendo-numerictextbox formControlName="UnitPrice" #UnitPrice required [format]="n0"> </kendo-numerictextbox>

                    <kendo-formhint>Type unit price</kendo-formhint>
                    <kendo-formerror>Error: Unit price is required</kendo-formerror>
                </kendo-formfield>

                <kendo-formfield>
                    <kendo-label [for]="UnitsInStock" text="Units in stock"></kendo-label>
                    <kendo-numerictextbox formControlName="UnitsInStock" #UnitsInStock required [format]="n0"> </kendo-numerictextbox>

                    <kendo-formhint>Type units</kendo-formhint>
                    <kendo-formerror>Error: Units must be between 0 and 999</kendo-formerror>
                </kendo-formfield>

                <kendo-formfield>
                    <div class="k-inline-checkbox" >
                        <input formControlName="Discontinued" kendoCheckBox #Discontinued type="checkbox" />
                        <kendo-label [for]="Discontinued" class="k-checkbox-label" text="Discontinued product"> </kendo-label>
                    </div>
                </kendo-formfield>
            </form>

            <kendo-dialog-actions>
                <button class="k-button" (click)="onCancel($event)">Cancel</button>
                <button class="k-button k-primary" [disabled]="!editForm.valid" (click)="onSave($event)">Save</button>
            </kendo-dialog-actions>
        </kendo-dialog>
    `
})
export class GridEditFormComponent {
  public active = false;
  public editForm: FormGroup = new FormGroup({
    ProductID: new FormControl(),
    ProductName: new FormControl('', Validators.required),
    UnitPrice: new FormControl(0),
    UnitsInStock: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])),
    Discontinued: new FormControl(false)
  });

  @Input() public isNew = false;

  @Input() public set model(product: Product) {
    this.editForm.reset(product);

    this.active = product !== undefined;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<Product> = new EventEmitter();

  public onSave(e): void {
    e.preventDefault();
    this.save.emit(this.editForm.value);
    this.active = false;
  }

  public onCancel(e): void {
    e.preventDefault();
    this.closeForm();
  }

  private closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }
}