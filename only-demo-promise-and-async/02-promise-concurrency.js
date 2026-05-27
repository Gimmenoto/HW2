/**
 * DEMO 2: Promise Concurrency Methods
 * Promise.all, Promise.allSettled, Promise.race, Promise.any
 *
 * Run: node 02-promise-concurrency.js
 */

function delay(name, ms, shouldReject = false) {
  console.log(`  Starting: ${name} (${ms}ms)`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        console.log(`  ✗ FAILED: ${name}`);
        reject(new Error(`${name} failed`));
      } else {
        console.log(`  ✓ Done: ${name}`);
        resolve(`${name} result`);
      }
    }, ms);
  });
}

async function demo() {
  // ── Promise.all: all must succeed, or entire thing rejects ──
  console.log("\n🔵 Promise.all — waits for ALL, fails if ANY rejects:");
  try {
    const results = await Promise.all([
      delay("Task-A", 300),
      delay("Task-B", 100),
      delay("Task-C", 200),
    ]);
    console.log("  Results:", results);
    // Output: ["Task-A result", "Task-B result", "Task-C result"]
  } catch (err) {
    console.log("  Caught:", err.message);
  }

  // ── Promise.all with rejection ──
  console.log("\n🔵 Promise.all — with a rejection:");
  try {
    await Promise.all([
      delay("Good-1", 100),
      delay("Bad-1", 200, true), // this rejects
      delay("Good-2", 300),
    ]);
  } catch (err) {
    console.log("  Immediately caught:", err.message);
    // Note: Good-1 already completed, Good-2 never starts (well, it started but its result is ignored)
  }

  // ── Promise.allSettled: waits for all, never rejects ──
  console.log("\n🟢 Promise.allSettled — waits for ALL, never rejects:");
  const settled = await Promise.allSettled([
    delay("Task-X", 200),
    delay("Task-Y", 100, true), // rejects
    delay("Task-Z", 300),
  ]);
  for (const r of settled) {
    if (r.status === "fulfilled") console.log("  ✓", r.value);
    else console.log("  ✗", r.reason.message);
  }

  // ── Promise.race: resolves/rejects with the FIRST to settle ──
  console.log("\n🏁 Promise.race — first to finish wins:");
  try {
    const winner = await Promise.race([
      delay("Fast", 100),
      delay("Slow", 500),
    ]);
    console.log("  Winner:", winner);
  } catch (err) {
    console.log("  Caught:", err.message);
  }

  // ── Promise.any: resolves with first FULFILLED, ignores rejections ──
  console.log("\n🟡 Promise.any — first to FULFILL wins (ignores rejections):");
  try {
    const firstGood = await Promise.any([
      delay("Failing-Fast", 100, true),
      delay("Failing-Slow", 300, true),
      delay("Success", 500),
    ]);
    console.log("  First success:", firstGood);
  } catch (err) {
    // AggregateError if ALL reject
    console.log("  All rejected:", err.message);
  }
}

demo().then(() => console.log("\n✅ All demos complete!"));
