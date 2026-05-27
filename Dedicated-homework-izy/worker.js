self.onmessage = (e) => {
    const limit = e.data;
    if (limit < 1) return 0;
    
    let a = 0; 
    let b = 1; 
    
    for(let index = 0 ; index < limit ; index++){
        let next = a + b;
        a = b;
        b = next;
    }
    
    self.postMessage(a); 
};