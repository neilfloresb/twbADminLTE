import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  public tbill: string;
  constructor(private _router: Router) { }

  ngOnInit(): void {

  }

  GenAndViewforJO(){
    let ids = "0000000005";
    this._router.navigate(['/home/billing/create', ids]);
  }

  GenAndViewforJO3() {
    let ids = "0000000003";
    this._router.navigate(['/home/billing/create', ids]);
  }

}
