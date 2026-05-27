const statusDisplay = document.getElementById('statusDisplay');
const limit = 1000000000;



function findFibonacciSync(limit) {
    if (limit < 1) return 0;
    
    let a = 0; 
    let b = 1; 
    
    for(let index = 0 ; index < limit ; index++){
        let next = a + b;
        a = b;
        b = next;
    }
    
    return a;
}


const btn = document.getElementById('btn-test');
const img = document.getElementById('img-container')

btn.addEventListener('click', () => {
  img.classList.add('animate');
  img.addEventListener('animationend', () => {
    img.classList.remove('animate');
  }, { once: true });

});

// wo worker
document.getElementById('noWorkerBtn').onclick = () => {
    statusDisplay.textContent = `Calculating on main thread ${limit}-th Fibonacchi sequence` ;
    
    setTimeout(() => {
        const start = performance.now();
        const result = findFibonacciSync(limit);
        const end = performance.now();
        statusDisplay.textContent = `Completed, found ${result}`;
    }, 100);
};

// w Worker
if (window.Worker) {
    const myWorker = new Worker('worker.js'); 

    document.getElementById('workerBtn').onclick = () => {
        statusDisplay.textContent = "Calculating with background thread";
        myWorker.postMessage(limit); // ส่งข้อมูลไปที่ Worker
    };

    myWorker.onmessage = (e) => {
        statusDisplay.textContent = `Completed, found ${e.data}`;
    };
}