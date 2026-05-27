
function checkInventory(itemName){
    return new Promise((resolve,reject) => { 
setTimeout(() => { 
    if(itemName === "Laptop"){
      resolve('instock');
    }else{
      reject('Out of stock');
    }
}, 500)});
}

    

checkInventory('Laptop')
.then(message => {
    console.log(message); 
})
.catch(error => {
    console.log(error); 
});