import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, setRxJsLoggingLevel } from '../common/debug';
import { RxJsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput') input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

         this.courseId = this.route.snapshot.params['id'];

         this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);

         this.lessons$ = this.loadLessons();
         
         //ForkJoin allows us to launch several tasks in parallel. Wait for these tasks to complete
         //and then can get back the result of each task and use those combined results together.

         //In subscribe, we will get tuple value which will contain both the outputs of observables.
         //Therefore, these two observables run in parallel, but these tuple value only emitted when
         //these observables completed. If any of observable won't complete, then none of tuple value
         //will ever be emitted.
         forkJoin(this.course$, this.lessons$)
                 .pipe
                    (tap(([course, lessons]) => {
                    console.log('course', course);
                    console.log('course', lessons);
                 })).subscribe();
    }

    ngAfterViewInit() {

         fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                startWith(''),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
              );

      }

    //switch map is all about unsubcription logic. let's say you want to cancel http request.
    loadLessons(search = '') : Observable<Lesson[]> {
       return createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
                         .pipe(
                             //This will transform the same into arrays
                             map(res => res['payload'])
                         );
    }



}
