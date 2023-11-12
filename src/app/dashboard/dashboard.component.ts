import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(IgxNavigationDrawerComponent, { static: true })
  public drawer: IgxNavigationDrawerComponent;

  currentUser;
  public title: string;
  public logo;

  public drawerState = {
    miniTemplate: false,
    open: true,
    pin: true
  };

  public showFirstGroup = false;
  public showSecondGroup = false;
  public showThirdGroup = false;
  public showFourthGroup = false;
  public showFifthGroup = false;
  public showSixthGroup = false;
  public showSevenGroup = false;

  public navItems = [
    { name: "account_circle", text: "Customer File" },
    { name: "add_shopping_cart", text: "Sales Order" },
    { name: "price_check", text: "Quotation" },
    { name: "airplanemode_active", text: "Delivery" },
    { name: "flight_takeoff", text: "DrD" },
    { name: "subject", text: "Quotation" },
    { name: "payments", text: "under construction" },
    { name: "library_books", text: "General Ledger" },
    { name: "FileCopy", text: "Billing Statement" },
    { name: "payments", text: "Payment" }

  ];

  constructor(private _location: Location, private router: Router) { }

  public selected = "Customer File";

  public navigate(item) {
    this.selected = item.text;
    if (!this.drawer.pin) {
      this.drawer.close();
    }
    // this.drawer.close();
  }

  showSubMenu(number) {
    if (number === 1) {
      this.showFirstGroup = !this.showFirstGroup;
    } else if (number === 2) {
      this.showSecondGroup = !this.showSecondGroup;
    } else if (number == 3) {
      this.showThirdGroup = !this.showThirdGroup;
    } else if (number == 6) {
      this.showSixthGroup = !this.showSixthGroup;
    } else if (number == 7) {
      this.showSevenGroup = !this.showSevenGroup;
    }
  }

  ngOnInit(): void {
    const userName = JSON.parse(localStorage.getItem('userName'));
    this.currentUser = userName;

    const _branchname = JSON.parse(localStorage.getItem('BranchName'));
    if (_branchname == 'ANS') {
      this.title = 'ANS';
      this.logo = '/assets/img/ans.jpg';
    } else {
      this.title = 'TWINBEE';
      this.logo = '/assets/img/TWINBEElogomain2021.png'
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('BranchName');
    localStorage.removeItem('AE');
    //   localStorage.removeItem('AEname');
    //   localStorage.removeItem('AElastname');
    localStorage.removeItem('entity');
    localStorage.removeItem('rights');
    localStorage.removeItem('name');
    localStorage.clear();

  }


  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('BranchName');
    localStorage.removeItem('AE');
    localStorage.removeItem('entity');
    localStorage.removeItem('rights');
    localStorage.removeItem('name');

    localStorage.clear();

    //   localStorage.removeItem('AElastname');
    this.router.navigate(['/user/login']);
  }

  public actionExc(event) {
    alert('Action Execute!');
  }

  public navigateBack() {
    this._location.back();
    //   //alert('Action GOback!');
  }
  public canGoBack() {
    return window.history.length > 0;
  }

}
