import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

xdescribe('Async Testing Examples', () => {
  // not the recomenned way of dong this
  it('Async test example wiht Jasmine done()', (done: DoneFn) => {

    let test = false;

    setTimeout(() => {
      console.log('running assertions');
      test = true;
      expect(test).toBeTruthy();
      done();
    } ,1000);

  });

  it('async example with setTimeout', fakeAsync(() => {

    let test = false;

    setTimeout(() => {
      console.log('running assertions set timeout');
      test = true;
    }, 1000);

    flush(); // all aysnc are completed...
    expect(test).toBeTruthy();

  }));

  it('Async test example - plain Promise', fakeAsync(() => {
    let test = false;

    console.log('create promise');

    Promise.resolve().then(() => {
      console.log('promise resolved');

      test = true;
    });

    flushMicrotasks(); // resolves promises on the micro task queue

    console.log('running assertions')

    expect(test).toBeTruthy();
  }));

  it('Async test example - Promise and setTimeout', fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {

      counter +=10;

      setTimeout(() => {
        counter +=1;
      }, 1000)

    });

    expect(counter).toBe(0);

    flushMicrotasks(); // resolves promises on the micro task queue
    expect(counter).toBe(10);

    tick(500); // goes half way through timeout

    expect(counter).toBe(10);

    tick(500); // completes timeout

    expect(counter).toBe(11);

  }));

  it('Aync test example - Observable', fakeAsync(() => {
    let test = false;

    console.log('Create Obs');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);
    console.log('running assertions');

    expect(test).toBe(true);
  }))
})
