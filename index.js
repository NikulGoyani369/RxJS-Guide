

function observable(observer) {
    // Producer cab be  setTimeOut, setInterval or any sort of source 
    
    let counter = 1;
    // atyare setInterval aapdo producer che and is wrap with our observable 
    const producer =  setInterval(() => {
        // Jyare koi value Emit thase thyare aapde next method no use karishu ane jyare aapde error define krvi hoi tyare aapde error function and last complete karvu hoi tyare complete function no upyog krano
        observer.next(counter++);
    }, 1000);

    // un-subscription logic means /teardown /close 
    return () => {
        // Depend upon the producer's/source close fn can be clearInterval, clearTimeout, removeEventListener, or any other mechanism.
        clearInterval(producer);
    }
}

const closeFn = observable({
    next: (data) => console.log(data),
    error: (err) => console.log('error', err),
    complete: () => console.log('Done'),
});


setTimeout(() => {
    closeFn();
}, 5000);