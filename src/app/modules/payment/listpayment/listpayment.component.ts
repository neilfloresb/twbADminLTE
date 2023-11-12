import { Component, OnInit } from '@angular/core';
import { from, fromEvent, Observable, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

interface MediaState {
  matches: boolean;
  media: string;
}

@Component({
  selector: 'app-listpayment',
  templateUrl: './listpayment.component.html',
  styleUrls: ['./listpayment.component.scss']
})
export class ListpaymentComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {
    const oneSec = of('1 second http req').pipe(delay(1000));
    const twoSec = of('2 second http req').pipe(delay(1000));
    const threeSec = of('3 second http req').pipe(delay(1000));
    const fourSec = of('4 second http req').pipe(delay(1000));
    const fiveSec = of('5 second http req').pipe(delay(1000));

    const map = from([oneSec,twoSec,threeSec,fourSec,fiveSec])
    .pipe(concatMap(x =>x),
    ).subscribe(x => console.log(x))



    // const fromMediaQueryEvent:(mediaQuery:string) => Observable<MediaState> = (mediaQuery:string)=>{
    //   const mediaQueryList = window.matchMedia(mediaQuery);
    //   return fromEvent(mediaQueryList,'change',(value:MediaQueryListEvent) => ({
    //     matches:value.matches,
    //     media: value.media
    //   }));
    // }
    // const screenOrientation$ = fromMediaQueryEvent('(orientation:portrait)');

  }

}

