import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuoteService } from 'src/app/service/quote.service';
import { ICustomer } from '../icustomer';

@Component({
  selector: 'app-custform-edit',
  templateUrl: './custform-edit.component.html',
  styleUrls: ['./custform-edit.component.scss']
})
export class CustformEditComponent {

  constructor(private quote: QuoteService) { }

  public active = false;
  public editForm: FormGroup = new FormGroup({
    custid: new FormControl(),
    custname: new FormControl('', Validators.required),
    cperson: new FormControl(),
    tin: new FormControl('', Validators.required),
    emailadd: new FormControl(),
    cposition: new FormControl(),
    ccontact: new FormControl(),
    cperson2: new FormControl(''),
    ccontact2: new FormControl(''),
    entity: new FormControl(''),
    active_flag: new FormControl(''),
    // UnitsInStock: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])),
    // Discontinued: new FormControl(false)
  });

  @Input() public isNew = false;

  @Input() public set model(customer: ICustomer) {
    this.editForm.reset(customer);

    this.active = customer !== undefined;
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<ICustomer> = new EventEmitter();

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
    let _entity = {
      cperson2: '',
      ccontact2: '',
      active_flag:'yes',
      entity: 'TWINBEE',
    };
    this.editForm.patchValue(_entity);

    if (this.isNew) {
      this.quote.saveCustomer(this.editForm.value).subscribe(
        () => {
        }
      ),
        (err: any) => console.log(err);
    } else {
      this.quote.saveUpdateCustomer(this.editForm.value).subscribe(
        () => {
        }
      ),
        (err: any) => console.log(err);
    };
  }

  // ngOnInit(): void {
  //  }
  // custid: number;
  // custmain?: string;
  // custname: string;
  // cperson?: string;
}
