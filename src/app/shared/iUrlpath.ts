import { environment } from '../../environments/environment';

const apiUrl = environment.apiEndPoint;
//const apiUrl = 'http://localhost:50384';
//const apiUrl = 'http://twinbeeprintads.com:8186';
//const apiUrl = 'http://www.twinbeeprintads.com:8010';
//const apiUrl = 'http://www.twinbeeprintads.com:22020'

//const WEBapiURLcore = 'http://localhost:33700';

const WEBapiURLcore = 'http://192.168.1.138:8016/';

export class mapapi {
  public static webmapapi: string = apiUrl + '/api/Customer/';

  public static webCOREapi: string = WEBapiURLcore + '/api/Cust/';
  // public static SalesByBranchAndService: string = apiUrl + '/api/SalesByBranchAndService/?startdate=08/01/2019&enddate=08/31/2019';
  public static SalesByBranchAndService: string =
    apiUrl + '/api/SalesByBranchAndService/?';
  //public static SalesByBranch: string = apiUrl + '/api/SalesByBranch/?startdate=07/01/2019&enddate=07/30/2019';
  public static SalesByBranch: string = apiUrl + '/api/SalesByBranch/?';

  public static SalesByBranchByMonth: string =
    apiUrl + '/api/SalesByBranchByMonth';
  public static SalesByBranchByDaily: string =
    apiUrl + '/api/SalesByBranchByDaily';

  public static SalesByBranchAndServicesByMonth: string =
    apiUrl + '/api/SalesByBranchAndServicesByMonth';
  public static SalesByBranchAndServicesByDaily: string =
    apiUrl + '/api/SalesByBranchAndServicesByDaily';

  public static SalesBOOKSummaryByBranchesByMonth: string =
    apiUrl + '/api/SalesBOOKSummaryByBranchesByMonth';
  public static SalesBOOKSummaryByBranchesByDaily: string =
    apiUrl + '/api/SalesBOOKSummaryByBranchesByDaily';


  public static USERS_data: string =
    apiUrl + '/api/users/';
  /// CUSTOMER DATA UPDATE

  public static UpdateCustomer: string =
    WEBapiURLcore + '/api/customer/custid=';
  /// get Custommer USING RXJS
  public static CustomerSAData: string =
    apiUrl + '/api/customersa';
  //END OF RXJS
  public static CustomerData: string =
    apiUrl + '/api/cust/';

  //
  public static SoHeaderList: string =
    apiUrl + '/api/soheader2';

  public static DrHeader: string =
    apiUrl + '/api/drheader';

  public static DrHeaderINDI: string =
    apiUrl + '/api/drHeaderINDi';
  // apiUrl + '/api/drdHeaderTASK';

  public static DrdDetails: string =
    apiUrl + '/api/drdDetailRepJSON';

  public static drdDETAILigxGridCRUD =
    apiUrl + '/api/drdDETAILsaveIGgrid'

  public static DrHeaderTASK: string =
    apiUrl + '/api/drdHeaderTASK';
  // apiUrl + '/api/drHeaderINDi';

  /*  USER AUTHENTICATION */
  public static UserAccess: string =
    apiUrl + '/api/useraccess';

  public static SignAccess: string =
    apiUrl + '/api/SignIN/';
  /*  End of User Authencation */


  //  get month data
  public static MonthData: string =
    apiUrl + '/api/monthlist';

  // Get Terms Table Data
  public static TermsTableData: string =
    apiUrl + '/api/termdata';

  /// PAYMENT LINK AREA
  public static GetPaymentHeader: string =
    apiUrl + 'http://localhost:33700';

  //PRINTING REPORT SOURCE API
  public static PrintResource: string =
    apiUrl + '/api/reports/';
  /// ANNUAL DUES
  //public static _getUrlDues: string = 'http://localhost:39586/api/AnnualDue?branchname=bacolod&year=2020'
  public static AnnualDues: string = apiUrl + '/api/annualdues/';

  /** GL LINKS */
  public static getControlnoSeries: string =
    apiUrl + '/api/gl_controlNO';
  public static jvGLHeader: string =
    apiUrl + '/api/glJVHeaderList';

  public static GLJVCrudHeader: string =
    apiUrl + '/api/GLJVCrudHeader';

  public static GLjvDetails: string =
    apiUrl + '/api/glJVDetails';

  public static glaccounts: string =
    apiUrl + '/api/GLAccountTitle'

  public static gljv_detailsCRUD: string =
    apiUrl + '/api/GLjvGRIDtransaction';


  /**for ANS WEB API LINK */
  public static ansquotationhdr: string =
    apiUrl + '/api/QuotationHDRJsonResult';
  public static ansquotationVIEWhdr: string =
    apiUrl + '/api/QuotationHDRTaskAsync';

  // Get CUSTOMER FILE FOR ANS
  public static customerAPIans: string =
    apiUrl + '/api/ANScustomer';

  // GetCustomer Listing Data for TWINBEE
  public static CustomerList: string =
    apiUrl + '/api/cust';

  public static ArtistAPI: string =
    apiUrl + '/api/Artist';

  public static quotationSeriesNo: string =
    apiUrl + '/api/getControlseriesno';

  public static quotationDtlJSONresult: string =
    apiUrl + '/api/quotationDETAILJsonResult';

  public static quoteDTlsCrudTRAN: string =
    apiUrl + '/api/QuoteDetailsGRIDTRANsaction';

  public static servicesListing: string =
    apiUrl + '/api/service';
  public static UnitOfMeasures: string =
    apiUrl + '/api/UnitOfMeasure';

  public static conFirmQuotion: string =
    apiUrl + '/api/CONfirmQUOTATION';

  public static forJobOrder: string =
    apiUrl + '/api/JobOrder';

  public static JobOrderList: string =
    apiUrl + '/api/JobOrderNO';

  public static QuotationCopy: string =
    apiUrl + '/api/QuotationCopy';
  //** BILLING  */
  public static billingConDtl: string =
    apiUrl + '/api/billing';
  public static billingConHeader: string =
    apiUrl + '/api/BilHeader';
  public static billingConBillDrdDetail: string =
    apiUrl + '/api/BillDrdDetails'

  //** PAYMENT */
  public static bankName: string =
    apiUrl + '/api/bankname'
  public static paymentHdr: string =
    apiUrl + 'PaymentHdr'
}
