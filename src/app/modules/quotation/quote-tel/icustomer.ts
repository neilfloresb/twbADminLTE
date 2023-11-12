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

export class Customer{
  custid: number = 0;
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