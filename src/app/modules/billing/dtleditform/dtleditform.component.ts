import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { IBillDtl } from '../../../shared/model/billing';
import { BillingService } from '../../../service/billing.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dtleditform',
  templateUrl: './dtleditform.component.html',
  styleUrls: ['./dtleditform.component.scss']
})
export class DtleditformComponent implements OnDestroy{

  public active = false;

  saveUpdateSubscription: Subscription;

  public _detailsValue: IBillDtl;

  public editForm: FormGroup = new FormGroup({
    billineno: new FormControl(0),
    billno: new FormControl('', Validators.required),
    itemdesc: new FormControl(),
    qty: new FormControl(0),
    unitprice: new FormControl(0),
    drno: new FormControl(''),
    sono: new FormControl(''),
    // UnitsInStock: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])),
    // Discontinued: new FormControl(false)
  });

  @Input() public isNew = false;

  @Input() public set model(customer: IBillDtl) {
    this.editForm.reset(customer);

    this.active = customer !== undefined;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<IBillDtl> = new EventEmitter();


  public onSave(e): void {
    e.preventDefault();
    this.savemap();
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

  savemap() {
    this._detailsValue = {
      billineno: this.editForm.value.billineno,
      billno: this.editForm.value.billno,
      itemdesc: this.editForm.value.itemdesc,
      qty: this.editForm.value.qty,
      sono: this.editForm.value.sono,
      unitprice: this.editForm.value.unitprice,
      drno: this.editForm.value.drno

    };
    // this.editForm.patchValue(_entity);

    if (!this.isNew) {
      this.saveUpdateSubscription= this.billservice.UpdateBillDetail(this._detailsValue).subscribe(
        () => {
        }
      ),
        (err: any) => console.log(err);
    }
  }
  constructor(private billservice: BillingService) { }

  ngOnDestroy(): void {
  //  this.saveUpdateSubscription.unsubscribe();
  }
  // ngOnInit(): void {

  //   public editActive = false;
  //   public _detailsValue: IBillDtl;
  //   public editForm: FormGroup = new FormGroup({
  //     billineno: new FormControl(0),
  //     billno: new FormControl(''),
  //     drno: new FormControl(''),
  //     itemdesc: new FormControl(''),
  //     qty: new FormControl(0),
  //     unitprice: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])),
  //     sono: new FormControl(''),
  //  //   vat_type: new FormControl(''),
  //   });

  //   @Input() public isNew = false;

  //   @Input() public set model(product: IBillDtl) {
  //     this.editForm.reset(product);

  //     this.editActive = product !== undefined;
  //   }

  //   @Output() cancel: EventEmitter<any> = new EventEmitter();
  //   @Output() save: EventEmitter<IBillDtl> = new EventEmitter();

  //   constructor(private billservice: BillingService) { }

  //   ngOnInit(): void {
  //   }

  //   public onCancel(e): void {
  //     e.preventDefault();
  //     this.closeForm();
  //   }

  //   private closeForm(): void {
  //     this.editActive = false;
  //     this.cancel.emit();
  //   }
  //   public onSave(e): void {
  //     e.preventDefault();
  //     this.savemap();
  //     this.save.emit(this.editForm.value);
  //     this.editActive = false;
  //   }

  //   savemap() {
  //     this._detailsValue = {
  //       billineno:this.editForm.value.billineno,
  //       billno: this.editForm.value.billno,
  //       itemdesc: this.editForm.value.itemdesc,
  //       qty: this.editForm.value.qty,
  //       sono: this.editForm.value.sono,
  //       unitprice: this.editForm.value.unitprice,
  //       drno: this.editForm.value.drno

  //     };
  //    // this.editForm.patchValue(_entity);

  //     if (!this.isNew) {
  //       this.billservice.UpdaeteBillDetail(this._detailsValue).subscribe(
  //         () => {
  //         }
  //       ),
  //         (err: any) => console.log(err);
  //     }

  //     //else {
  //     //   this.quote.saveUpdateCustomer(this.editForm.value).subscribe(
  //     //     () => {
  //     //     }
  //     //   ),
  //     //     (err: any) => console.log(err);
  //     // };
  //   }

}
