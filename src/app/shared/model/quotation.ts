export interface IQuotation {
  sqno: string;
  custid: number;
  vat_type: string;
  termid: string;
  warranty: string;
  delivery: string;
  sqdate: string;
  status: string;
  acperson: string;
  contactp: string;
  branchname: string;
  userid: string;
  remarks?: string;
  confirm_ref?: string;
  confirm_date?: string;
  discnt: number;
  so_no?: string;
  artcode: number;
  quoteflag?: string;
  deldate?: string;
}

export class IConfirmQuotation {
  sqno: string;
  confirm_ref?: string;
  confirm_date?: string;
  deldate?: string;
}

export interface IQuoteDTL {
  seqlineno: number;
  sqno: string;
  desc: string;
  size?: string;
  um: string;
  qty: number;
  unitcost: number;
  discnt: number;
  materials?: string;
  serviceID: string;
  finalfin?: string;
  vatamt: number;
  nopage: number;
  prints?: string;

}

export class IQuoteDTLCRUD {
  private seqlineno: number;
  private sqno: string;
  private desc: string;
  private size?: string;
  private um: string;
  private qty_order: number;
  private unitcost: number;
  private uprice: number;
  private materials?: string;
  private serviceID: string;
  private finalfin?: string;

  constructor() {
    this.seqlineno = 1;
    this.sqno = "";
    this.desc = "";
    this.size = "";
    this.um = "";
    this.qty_order = 0;
    this.unitcost = 0;
    this.uprice = 10;
    this.materials = "";
    this.serviceID = "";
    this.finalfin = "";
  }
}