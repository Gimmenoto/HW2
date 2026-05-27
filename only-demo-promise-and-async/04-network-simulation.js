/**
 * DEMO 4: Network Request Simulation
 * Simulates fetch with timeout, retry, and sequential vs parallel requests
 *
 * Run: node 04-network-simulation.js
 */

// ── Simulated fetch ──
function fakeFetch(url, delayMs, shouldFail = false) {
  console.log(`  📡 GET ${url}...`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error(`Network error for ${url}`));
      else resolve({ status: 200, data: `Response from ${url}` });
    }, delayMs);
  });
}

// ── Fetch with timeout ──
function fetchWithTimeout(url, delayMs, timeoutMs) {
  console.log(`\n⏱️  Fetching ${url} with ${timeoutMs}ms timeout`);
  return Promise.race([
    fakeFetch(url, delayMs),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${url} took > ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// ── Fetch with retry ──
async function fetchWithRetry(url, delayMs, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  Attempt ${attempt}/${maxRetries} for ${url}`);
      const result = await fakeFetch(url, delayMs, attempt < maxRetries); // fail first N-1 times
      return result;
    } catch (err) {
      console.log(`  ❌ Attempt ${attempt} failed: ${err.message}`);
      if (attempt === maxRetries) throw err;
      console.log(`  🔄 Retrying...`);
    }
  }
}

// ── Sequential vs Parallel ──
async function sequential() {
  console.log("\n🐢 Sequential (one at a time):");
  const start = Date.now();
  const a = await fakeFetch("/api/users", 200);
  const b = await fakeFetch("/api/posts", 200);
  const c = await fakeFetch("/api/comments", 200);
  console.log(`  Total: ${Date.now() - start}ms`);
  return [a, b, c];
}

async function parallel() {
  console.log("\n🐇 Parallel (all at once):");
  const start = Date.now();
  const [a, b, c] = await Promise.all([
    fakeFetch("/api/users", 200),
    fakeFetch("/api/posts", 200),
    fakeFetch("/api/comments", 200),
  ]);
  console.log(`  Total: ${Date.now() - start}ms`);
  return [a, b, c];
}

// ── Run all demos ──
async function demo() {
  // Timeout demo
  try {
    const result = await fetchWithTimeout("/slow-api", 2000, 500);
    console.log("  Result:", result);
  } catch (err) {
    console.log("  ❌", err.message);
  }

  // Successful timeout
  try {
    const result = await fetchWithTimeout("/fast-api", 100, 500);
    console.log("  Result:", result);
  } catch (err) {
    console.log("  ❌", err.message);
  }

  // Retry demo
  console.log("\n🔄 Retry demo:");
  try {
    const result = await fetchWithRetry("/flaky-api", 100);
    console.log("  ✅ Success:", result);
  } catch (err) {
    console.log("  ❌ All retries exhausted:", err.message);
  }

  // Sequential vs Parallel
  await sequential();
  await parallel();
}

demo().then(() => console.log("\n✅ All network demos complete!"));
