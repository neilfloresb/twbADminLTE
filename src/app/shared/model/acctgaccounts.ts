export interface IGLacconts {
  acct_code: number;
  acct_classl?: string;
  acct_classn?: number;
  acct_desc: string;
  sl_status: number;
  active_flag?: number;
  gl_ref?:number;
}

export interface JVaccts {
  acct_code: number;
  // acct_classl?: string;
  // acct_classn?: number;
  acct_desc: string;
  // sl_status: number;
  // active_flag?: number;
  // gl_ref?: number;
}

export interface glControNO {
  control_no: number;
  book_code: string;
}