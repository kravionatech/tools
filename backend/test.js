import assert from "node:assert";
import { normalizeDomain, domainAge } from "./src/seo.js";
import { seoProvider } from "./src/providers/seoProvider.js";

async function runTests() {
  console.log("Running Backend Tests...");

  // Test 1: normalizeDomain
  console.log("1. Testing normalizeDomain...");
  assert.strictEqual(normalizeDomain("example.com"), "example.com");
  assert.strictEqual(normalizeDomain("https://www.example.com/path"), "example.com");
  assert.strictEqual(normalizeDomain("http://sub.domain.org:8080/"), "sub.domain.org");
  assert.throws(() => normalizeDomain(""), /enter a domain/);
  assert.throws(() => normalizeDomain("notadomain"), /valid domain/);
  console.log("   ✓ normalizeDomain tests passed.");

  // Test 2: seoProvider unconfigured behavior
  console.log("2. Testing seoProvider unconfigured state...");
  const metrics = await seoProvider.fetchMetrics("example.com");
  assert.strictEqual(metrics.available, false);
  assert.strictEqual(metrics.provider, "Moz API v2");
  assert.ok(metrics.reason.includes("credentials not configured"));
  console.log("   ✓ seoProvider unconfigured behavior verified (no fake scores).");

  // Test 3: domainAge with live RDAP
  console.log("3. Testing domainAge RDAP lookup...");
  const age = await domainAge("github.com");
  if (!age.available) {
    console.warn("   ⚠️  RDAP notice:", age.reason);
  }
  assert.ok(age !== null && typeof age === "object");
  assert.ok(typeof age.available === "boolean");
  if (age.available) {
    assert.ok(age.createdAt.startsWith("2007"));
    assert.ok(age.age.includes("year"));
    assert.strictEqual(age.registrar, "MarkMonitor Inc.");
    console.log("   ✓ domainAge live RDAP verified:", age.age);
  } else {
    console.log("   ✓ domainAge handled unavailable registry gracefully:", age.reason);
  }

  console.log("\nAll backend tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
