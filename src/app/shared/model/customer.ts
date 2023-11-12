export class Customer{
  // get Custid() {
  //   return this.custid;
  // }
  // set Custid(val) {
  //   this.custid = val;
  // }
  // get Custname() {
  //   return this.custname;
  // }
  // set Custname(val) {
  //   this.custname = val;
  // }

  // get Cperson() {
  //   return this.cperson;
  // }
  // set Cperson(val) {
  //   this.cperson = val;
  // }

  // get Cposition() {
  //   return this.cposition;
  // }
  // set Cposition(val) {
  //   this.cposition = val;
  // }

  // get Ccontact() {
  //   return this.ccontact;
  // }
  // set Ccontact(val) {
  //   this.ccontact = val;
  // }
  // get Emailadd() {
  //   return this.emailadd;
  // }
  // set Emailadd(val) {
  //   this.emailadd = val;
  // }

  // get Active_flag() {
  //   return this.active_flag;
  // }
  // set Active_flag(val) {
  //   this.active_flag = val;
  // }


  private custid: number;
  private custmain?: string;
  private custname: string;
  private cperson?: string;
  private cperson2?: string;
  private cposition?: string;
  private ccontact?: string;
  private ccontact2?: string;
  private emailadd?: string;
  private active_flag: string;
  private entity: string;
  private tin?: string;

  constructor() {
    this.custid = 1;
    this.custmain = "";
    this.custname = '';
    this.cperson = '';
    this.ccontact2 = "";
    this.cposition = '';
    this.ccontact = '';
    this.ccontact2 = '';
    this.emailadd = '';
    this.active_flag = 'yes';
    this.entity = "";
    this.tin = "";
  }
}

export interface ICustomer {
  custid: number;
  custmain?: string;
  custname: string;
  cperson?: string;
  cperson2?: string;
  cposition?: string;
  ccontact?: string;
  ccontact2?: string;
  emailadd?: string;
  active_flag: string;
  entity: string;
  tin?: string;
}

export interface ICustomerList {
  custid: string;
  custname: string;
}

export interface ITermTable {
  termid: string;
  termname: string;
}

