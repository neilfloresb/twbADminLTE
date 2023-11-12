import { HttpClient } from '@angular/common/http';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { mapapi } from '../shared/iUrlpath';
import { SERvice, UMeasure } from '../shared/model/service';


const _Services = mapapi.servicesListing;
const _Umeasures = mapapi.UnitOfMeasures;
@Injectable({
  providedIn: 'root'
})
export class BooktypeService {
  constructor(private _http: HttpClient) { }
  public bookstype = [
    { type: 'AP', bookname: 'ACCOUNT PAYABLE' },
    { type: 'AR', bookname: 'ACCOUNT RECEIVABLE' },
    { type: 'CDJ', bookname: 'CASH DISBURSEMENT JOURNAL' },
    { type: 'JV', bookname: 'GENERAL JOURNAL' },
  ];

  getSERVICElist(): Observable<SERvice[]>  {
    const _servicesdata = `${_Services}`;
    return this._http.get<SERvice[]>(_servicesdata);
  }

  getUNITofMEASURE(): Observable<UMeasure[]> {
    const _umeasuresData = `${_Umeasures}`;
    return this._http.get<UMeasure[]>(_umeasuresData);
  }

}

export class QuotationService {
 // constructor(private _http: HttpClient) { }
  public vattype: string[] = [
    'INCLUSIVE',
    'EXCLUDED',
  ];
  //constructor() { }

  public warrantytype = [
    { type: '0', name: 'N/A' },
    { type: '1', name: '6 Months' },
    { type: '2', name: '1 Year' },
    { type: '3', name: '2 Years' }
  ]

  public deliverytype: string[] = [
    'Within 2-3 days', 'Within 5-7 days', 'Within 7-10 days',
    'Within 10-15 days', 'Within 4-5 weeks', 'N/A'
  ]

  public unitofmeasure = [
     {'um':'PC'},
     {'um':'PCS'},
     {'um':'SET'},
     {'um':'SETS'},
     {'um':'LOT'},
     {'um':'LOTS'}
  ];

}

@Pipe({ name: 'displayFormat' })
export class DisplayFormatPipe implements PipeTransform {
  transform(value: any): string {
    let val = value;

    if (val === '__.__') {
      val = '';
    }

    if (val && val.indexOf('_') !== -1) {
      val = val.replace(new RegExp('_', 'g'), '0');
    }

    if (val && val.indexOf('%') === -1) {
      val += ' %';
    }

    if (val && val.indexOf('-') === -1) {
      val = val.substring(0, 0) + '-' + val.substring(0);
    }

    return val;
  }
}

@Pipe({ name: 'inputFormat' })
export class InputFormatPipe implements PipeTransform {
  transform(value: any): string {
    let val = value;

    if (!val) {
      val = '__.__';
    }

    if (val.indexOf(' %') !== -1) {
      val = val.replace(new RegExp(' %', 'g'), '');
    }

    if (val.indexOf('-') !== -1) {
      val = val.replace(new RegExp('-', 'g'), '');
    }

    return val;
  }
}
