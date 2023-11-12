export interface JobOrder {
  jono: string;
  sqno: string;
  seqlineno: number;
  //status: string;
}

export interface JobOrderList {
  jono: string;
  jolineno: number;
  itemdesc: string;
  size: string;
  um: string;
  qty: number;
  materials:string;
}