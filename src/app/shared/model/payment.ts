export interface IPaymentHdr {
  paydocno: string;
  custid: number;
  doctype: string;
  paytype: string;
  bank_code?: number;
  paymentdate: string;
  chkdate: string;
  chkno?: string;
  amt_paid: number;
  amt_applied: number;
  status_mode: string;
  branchname: string;
  userid: string;
  status?: StatusCode;
}

export enum StatusCode {
  Unchanged,
  Added,
  Deleted,
  Updated
}