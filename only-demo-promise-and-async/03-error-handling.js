/**
 * DEMO 3: Error Handling with Async/Await
 * try/catch, .catch(), unhandled rejections, and best practices
 *
 * Run: node 03-error-handling.js
 */

// ── Simulated API functions ──
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error(`Invalid user ID: ${id}`));
      else resolve({ id, name: `User${id}` });
    }, 100);
  });
}

function fetchOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 3) reject(new Error("Database timeout"));
      else resolve([`Order-${userId}-A`, `Order-${userId}-B`]);
    }, 100);
  });
}

// ── Approach 1: try/catch with async/await ──
async function approach1_tryCatch(userId) {
  console.log(`\n🔵 Approach 1: try/catch for user ${userId}`);
  try {
    const user = await fetchUser(userId);
    console.log("  User:", user);
    const orders = await fetchOrders(user.id);
    console.log("  Orders:", orders);
    return { user, orders };
  } catch (err) {
    console.log("  ❌ Caught:", err.message);
    return null; // graceful fallback
  }
}

// ── Approach 2: .catch() chaining ──
function approach2_catchChain(userId) {
  console.log(`\n🟢 Approach 2: .catch() chain for user ${userId}`);
  return fetchUser(userId)
    .then((user) => {
      console.log("  User:", user);
      return fetchOrders(user.id);
    })
    .then((orders) => {
      console.log("  Orders:", orders);
      return { orders };
    })
    .catch((err) => {
      console.log("  ❌ Caught:", err.message);
      return null;
    });
}

// ── Approach 3: handling error per-step ──
async function approach3_perStep(userId) {
  console.log(`\n🟡 Approach 3: per-step handling for user ${userId}`);

  const user = await fetchUser(userId).catch((err) => {
    console.log("  ⚠️ Could not fetch user:", err.message);
    return null;
  });

  if (!user) return null;

  const orders = await fetchOrders(user.id).catch((err) => {
    console.log("  ⚠️ Could not fetch orders:", err.message);
    return [];
  });

  console.log("  User:", user);
  console.log("  Orders:", orders);
  return { user, orders };
}

// ── Promise constructor anti-pattern (DON'T DO THIS) ──
// Wrapping a promise in new Promise() is redundant and loses error context
function badPattern(id) {
  // WRONG: unnecessary wrapper
  return new Promise((resolve, reject) => {
    fetchUser(id).then(resolve).catch(reject);
  });
}
// CORRECT: just return the existing promise
function goodPattern(id) {
  return fetchUser(id);
}

// ── Run all approaches ──
async function demo() {
  // Successful case
  await approach1_tryCatch(1);
  await approach2_catchChain(2);
  await approach3_perStep(2);

  // Error cases
  await approach1_tryCatch(-1); // invalid ID
  await approach2_catchChain(3); // DB timeout
  await approach3_perStep(0); // invalid ID

  // Bonus: unhandled rejection warning (commented out — would crash Node)
  // Promise.reject(new Error("Unhandled!"));
  // Proper: Promise.reject(new Error("x")).catch(console.error);
}

demo().then(() => console.log("\n✅ Done!"));
