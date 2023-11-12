export class iCustomerINFOCRUD {
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
    this.custid = 0;
    this.custmain = '';
    this.custname = '';
    this.cperson = '';
    this.cperson2 = '';
    this.cposition = '';
    this.ccontact = '';
    this.ccontact2 = '';
    this.emailadd = '';
    this.active_flag = 'yes';
    this.entity = '';
    this.tin = '';
  }
}
