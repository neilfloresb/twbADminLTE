import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { observable, of, pipe } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { QuoteService } from 'src/app/service/quote.service';

@Component({
  selector: 'app-testobservablefind',
  templateUrl: './testobservablefind.component.html',
  styleUrls: ['./testobservablefind.component.scss']
})
export class TestobservablefindComponent implements OnInit {

  public quoteForm: FormGroup;
  sqno;
  constructor(private _quote: QuoteService, private fb: FormBuilder) { }

  ngOnInit(): void {
  this.initForm();

  const quoteSearch$ = quote => this._quote.getQuotationByNO(quote)
  pipe (
    catchError(_ => of('no more requests!!!'))
  );

  const getSqno = this.quoteForm.get("sqno").valueChanges;
  //  this.quoteForm.get("sqno").valueChanges
  //  .subscribe(sq => {
  //    console.log(sq);
  //  });

  getSqno
  .pipe(
    switchMap(quoteSearch$)
  )
  .subscribe(res =>
    {
      console.log(res);
    },
    (err: any) => console.log('Boom' + err)
    );
  }

  initForm(){
  //  this.sqno = new FormControl();
   this.quoteForm = this.fb.group({
     sqno: [''],
   })
  }

}
