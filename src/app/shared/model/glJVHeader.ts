export interface IGLJVheader {
  ref_no: string;
  source: string;
  trans_code: string;
  book_code: string;
  trans_date: string;
  fiscal_year: number;
  fiscal_period: string;
  exch_rate: number;
  currency_code: string;
  userid: string;
  remarks: string;

}

// export interface IGLjvHdr {
//   ref_no: string;
//   source_: string;
// }
export interface IGLJVdetails {
  line_ctrl_no: number;
  ref_no: string;
  source?: string;
  trans_code?: string;
  line_no?: number;
  acct_code: number;
  dr_amt: number;
  cr_amt: number;
  sl_type?: string;
  sll_code?: string;
  remarks?: string;
  cs_type?: string;
  cs_code?: string;
  acct_desc: string;
}


export class jvgl_CRUDdetail {
  private line_ctrl_no: number;
  private ref_no: string;
  private source?: string;
  private  trans_code?: string;
  private line_no: number;
  private acct_code: number;
  private dr_amt: number;
  private cr_amt: number;
  private sl_type?: string;
  private  sll_code?: string;
  private remarks?: string;
  private cs_type?: string;
  private  cs_code?: string;
  private  acct_desc: string;

  constructor () {
    this.line_ctrl_no = 1;
    this.ref_no = "";
    this.source = "";
    this.trans_code ="";
    this.line_no = 0;
    this.acct_code = 0;
    this.dr_amt = 0;
    this.cr_amt = 0;
    this.sl_type = "";
    this.sll_code = "";
    this.remarks = "";
    this.cs_type = "";
    this.cs_code = "";
    this.acct_desc = "";
  }

}