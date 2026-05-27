/**
 * DEMO 1: The JavaScript Event Loop
 * Shows the execution order of: synchronous code → microtasks → macrotasks
 *
 * Run: node 01-event-loop.js
 */

console.log("🥚 1. Synchronous start");

setTimeout(() => {
  console.log("⏰ 5. setTimeout (macrotask - 0ms delay)");
}, 0);

Promise.resolve().then(() => {
  console.log("🔷 3. Promise.then #1 (microtask)");
});

queueMicrotask(() => {
  console.log("🔹 4. queueMicrotask (microtask)");
});

Promise.resolve()
  .then(() => {
    console.log("🔷 2. Promise.then #2 (microtask)");
    // A microtask scheduling another microtask runs it in the SAME cycle
    Promise.resolve().then(() => {
      console.log("🔷 inner microtask (runs before next macrotask)");
    });
  });

setTimeout(() => {
  console.log("⏰ 6. setTimeout (macrotask - 10ms delay)");
  Promise.resolve().then(() => {
    console.log("🔷 7. Microtask inside macrotask");
  });
}, 10);

console.log("🥚 Synchronous end");

/*
EXPECTED OUTPUT:
🥚 1. Synchronous start
🥚 Synchronous end
🔷 2. Promise.then #2 (microtask)
🔷 inner microtask (runs before next macrotask)
🔷 3. Promise.then #1 (microtask)
🔹 4. queueMicrotask (microtask)
⏰ 5. setTimeout (macrotask - 0ms delay)
⏰ 6. setTimeout (macrotask - 10ms delay)
🔷 7. Microtask inside macrotask
*/
