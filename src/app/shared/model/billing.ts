export interface iBillPost {
  billno: number;
  drno: string;
}

export interface IBillDtl {
  billineno: number;
  billno: number;
  itemdesc: string;
  unitprice: number;
  qty: number;
  drno: string;
  sono: string;
}

export interface billinDETAIL {
  billineno: number;
  billno: number;
  itemdesc: string;
  unitprice: number;
  qty: number;
  drno: string;
  sono: string;
  amt?: number;
}

export interface IBillHeader {
  billno: number;
  billseries: string;
  custid: number;
  billto: string;
  trndate: string;
  duedate: string;
  page: string;
  terms: string;
  branchname: string;
  pono: string;
  userid: string;
  issuedby:string;
  status?: StatusCode;
}

export enum StatusCode {
  Unchanged,
  Added,
  Deleted,
  Updated
}

export interface IDrdBillDtl {
  billineno: number;
  billno: number;
  drno: string;
  itedesc: string;
  qty: number;
  unitcost: number;
  sono: string;
  vat_type: string;
  um: string;
  amtfor?: number;
}

export interface IviewDrdDetail {
  drlineno: number;
  drno: string;
  item_desc: string;
  size: string;
  qtydr: number;
  unitcost: number;
  um: string;
  sono: string;
  discnt: number;
  vat_type: string;
  ucost: number;
  subamt: number;
  amtFor?: number;
}
export class BillDetail {
  billineno: number;
  billno: number;
  itemdesc: string;
  unitprice: number;
  qty: number;
  drno: string;
  sono: string;
}
export class BillHeaderPost {
  billno: number;
  billseries: string;
  custid: number;
  billto: string;
  trndate: string;
  duedate: string;
  page: string;
  terms: string;
  branchname: string;
  issuedby: string;
  pono: string;
  userid: string;
}