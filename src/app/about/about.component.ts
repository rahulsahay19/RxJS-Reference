import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, timer, fromEvent, Observable, observable, noop, of } from 'rxjs';
import { createHttpObservable } from '../common/util';
import { map, concat, merge } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
