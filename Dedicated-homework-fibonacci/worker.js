self.onmessage = (e) => {
    const n = e.data;
    
    function fib(num) {
        if (num <= 1) return num;
        return fib(num - 1) + fib(num - 2);
    }
    
    const start = performance.now();
    const result = fib(n);
    const end = performance.now();
    
    self.postMessage({
        n: n,
        result: result,
        time: ((end - start) / 1000).toFixed(2)
    });
};