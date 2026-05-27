const statusDisplay = document.getElementById('statusDisplay');
const refreshIcon = document.getElementById('refreshIcon');
const fibInput = document.getElementById('fibInput');

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

refreshIcon.classList.add('spin-refresh');

document.getElementById('noWorkerBtn').onclick = () => {
    const n = parseInt(fibInput.value);
    if (isNaN(n)) return;
    
    refreshIcon.classList.remove('spin-refresh');
    statusDisplay.textContent = `Calculating fib(${n}) on main thread`;
    
    setTimeout(() => {
        const start = performance.now();
        const result = fibonacci(n);
        const end = performance.now();
        
        refreshIcon.classList.add('spin-refresh');
        statusDisplay.textContent = `fib(${n}) = ${result} (${((end-start)/1000).toFixed(2)}s)`;
    }, 10);
};

if (window.Worker) {
    const myWorker = new Worker('worker.js');

    document.getElementById('workerBtn').onclick = () => {
        const n = parseInt(fibInput.value);
        if (isNaN(n)) return;
        
        refreshIcon.classList.add('spin-refresh');
        statusDisplay.textContent = `Calculating fib(${n}) with responsive thread`;
        myWorker.postMessage(n);
    };

    myWorker.onmessage = (e) => {
        statusDisplay.textContent = `fib(${e.data.n}) = ${e.data.result} (${e.data.time}s)`;
    };
}