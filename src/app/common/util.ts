import { Observable } from 'rxjs';

export function createHttpObservable(url: string) {
    return Observable.create(observer => {
      const controller = new AbortController();
      const signal = controller.signal;
       fetch(url, {signal})
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              observer.error('Request failed with status code' + response.status);
            }
           
          })
          .then(body => {
            //this is the value used to emit the value in the observable
            observer.next(body);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });

          return () => controller.abort();
   });
    }

