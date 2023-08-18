class ObserverGuard {
  constructor(observer) {
    this.observer = observer;
    this.isUnSubscribe = false;
  }

  next(data) {
    if (this.isUnSubscribe || !this.observer.next) {
      return;
    }

    try {
      this.observer.next(data);
    } catch (err) {
      this.unsubscribe();
      throw err;
    }
  }

  error(err) {
    if (this.isUnSubscribe || !this.observer.error) {
      return;
    }

    try {
      this.observer.error(err);
    } catch (innerError) {
      this.unsubscribe();
      throw innerError;
    }

    this.unsubscribe();
  }

  complete() {
    if (this.isUnSubscribe || !this.observer.complete) {
        // this.unsubscribe(); // aa jyare declare krvanu ke jyare tame complete vali  method call na kro tyare 
      return;
    }

    try {
      this.observer.complete();
    } catch (err) {
      this.unsubscribe();
      throw err;
    }

    this.unsubscribe();
  }

  unsubscribe() {
    this.isUnSubscribe = true;

    if (this.closeFn) {
      this.closeFn();
    }
  }

  closed() {
    return this.isUnSubscribe;
  }
}

class Observable {
  constructor(blueprint) {
    this.observable = blueprint;
  }

  subscribe(observer) {
    const observerWithGuard = new ObserverGuard(observer);
    const closeFn = this.observable(observerWithGuard);

    observerWithGuard.closeFn = closeFn;

    const subscription =  this.subScriptionMetaData(observerWithGuard);

    return subscription;
  }

  // for extra ke unsub() function really ma bandh thyu che ke nhi  tena mate nu niche nu function che
  subScriptionMetaData(observerWithGuard) {
    return {
        unsubscribe() {
            observerWithGuard.unsubscribe();
        },
        closed() {
            return observerWithGuard.closed();
        },
    }
  }
}

const newObservable = new Observable(function (observer) {
  // producer
  // observer.next('hello');
  // observer.next('world');
  // observer.complete();

  let counter = 1;
  const producer =  setInterval(() => {
      observer.next(counter++);

    if(counter > 5) {
    observer.complete();
    }
  }, 1000);



  // un-subscription logic means /teardown /close
  return () => {
    clearInterval(producer);
  };
});

const subscription = newObservable.subscribe({
  next: (data) => console.log("obs 1", data),
  error: (err) => console.log("obs 1error", err),
  complete: () => console.log("obs 1 Done"),
});

// console.log(subscription.closed());
// setTimeout(() => {
//   subscription.unsubscribe();  
// console.log(subscription.closed());
// }, 5000);




// function observable(observer) {
//     // Producer cab be  setTimeOut, setInterval or any sort of source

//     let counter = 1;
//     // atyare setInterval aapdo producer che and is wrap with our observable
//     const producer =  setInterval(() => {
//         // Jyare koi value Emit thase thyare aapde next method no use karishu ane jyare aapde error define krvi hoi tyare aapde error function and last complete karvu hoi tyare complete function no upyog krano
//         observer.next(counter++);
//     }, 1000);

//     // un-subscription logic means /teardown /close
//     return () => {
//         // Depend upon the producer's/source close fn can be clearInterval, clearTimeout, removeEventListener, or any other mechanism.
//         clearInterval(producer);
//     }
// }

// const closeFn = observable({
//     next: (data) => console.log('obs 1',data),
//     error: (err) => console.log('obs 1error', err),
//     complete: () => console.log('obs 1 Done'),
// });



// setTimeout(() => {
//     closeFn();
// }, 5000);

// // now we see unicast Observable che te sepreate observer bnave che badha mate, kem ke tya 1 producer ane 2 observer hoi che to bane observers ne alag alag data mle che

// setTimeout(() => {
//     const closeFn2 = observable({
//         next: (data) => console.log('obs 2', data),
//         error: (err) => console.log('obs 2', err),
//         complete: () => console.log('obs 2 done'),
//     })
// }, 2000)
