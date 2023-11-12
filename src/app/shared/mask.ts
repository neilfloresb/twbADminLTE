import { Pipe, PipeTransform } from '@angular/core';

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