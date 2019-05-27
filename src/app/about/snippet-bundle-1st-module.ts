import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, timer, fromEvent } from 'rxjs';

@Component({
  selector: 'first-module',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class FirstModuleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //simple observable. defn of stream of values.
  //  const interval$ = interval(1000);

    //An observable will only become stream, once we subscribe to this
    // interval$.subscribe(val => console.log("stream 1 " + val));
    // interval$.subscribe(val => console.log("stream 2 " + val));

    //Now, lets wait for 3 sec and then create stream

    const interval$ = timer(3000, 1000);
    const sub = interval$.subscribe(val => console.log("stream 1 " + val));

    setTimeout(() => {
      sub.unsubscribe();
    }, 5000);

    //click stream example fromEvent method

    const click$ = fromEvent(document, 'click');
    click$.subscribe(
      evt => console.log(evt),
      err => console.log(err),
      () => console.log("completed")
      );

  }

}
