import { generateCode } from './core/generator.js';
import assert from 'assert';

let testsPassed = 0;
let testsFailed = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`✅ ${testName}`);
    testsPassed++;
  } catch (e) {
    console.error(`❌ ${testName}:`, e.message);
    testsFailed++;
  }
}

// Test 1: Basic functionality
runTest("Basic code generation", () => {
  const data = {
    clientName: "Test Clinic",
    botGoal: "Teeth Cleaning"
  };

  const output = generateCode(data);
  assert(output.includes("Fulfillment for Test Clinic"));
  assert(output.includes("Goal: Teeth Cleaning"));
  assert(output.includes('agent.add("Okay " + parameters.name + ", I can help you with Teeth Cleaning.");'));
});

// Test 2: Special characters handling
runTest("Special characters in client name", () => {
  const data = {
    clientName: "Test & Co. (Main) [Branch]",
    botGoal: "Appointment"
  };

  const output = generateCode(data);
  assert(output.includes("Fulfillment for Test & Co. (Main) [Branch]"));
  assert(output.includes("Goal: Appointment"));
});

// Test 3: Special characters in bot goal
runTest("Special characters in bot goal", () => {
  const data = {
    clientName: "Clinic",
    botGoal: "Booking $100+ appointments"
  };

  const output = generateCode(data);
  assert(output.includes("Goal: Booking $100+ appointments"));
});

// Test 4: Missing data parameter
runTest("Null data parameter throws error", () => {
  try {
    generateCode(null);
    throw new Error("Should have thrown error for null data");
  } catch (e) {
    assert(e.message.includes("Invalid data parameter"));
  }
});

// Test 5: Missing clientName
runTest("Missing clientName throws error", () => {
  try {
    generateCode({ botGoal: "Test" });
    throw new Error("Should have thrown error for missing clientName");
  } catch (e) {
    assert(e.message.includes("clientName"));
  }
});

// Test 6: Missing botGoal
runTest("Missing botGoal throws error", () => {
  try {
    generateCode({ clientName: "Test" });
    throw new Error("Should have thrown error for missing botGoal");
  } catch (e) {
    assert(e.message.includes("botGoal"));
  }
});

// Test 7: Empty string clientName
runTest("Empty clientName throws error", () => {
  try {
    generateCode({ clientName: "", botGoal: "Test" });
    throw new Error("Should have thrown error for empty clientName");
  } catch (e) {
    assert(e.message.includes("clientName"));
  }
});

// Test 8: Empty string botGoal
runTest("Empty botGoal throws error", () => {
  try {
    generateCode({ clientName: "Test", botGoal: "" });
    throw new Error("Should have thrown error for empty botGoal");
  } catch (e) {
    assert(e.message.includes("botGoal"));
  }
});

// Test 9: Non-string clientName
runTest("Non-string clientName throws error", () => {
  try {
    generateCode({ clientName: 123, botGoal: "Test" });
    throw new Error("Should have thrown error for non-string clientName");
  } catch (e) {
    assert(e.message.includes("clientName"));
  }
});

// Test 10: Non-string botGoal
runTest("Non-string botGoal throws error", () => {
  try {
    generateCode({ clientName: "Test", botGoal: 456 });
    throw new Error("Should have thrown error for non-string botGoal");
  } catch (e) {
    assert(e.message.includes("botGoal"));
  }
});

// Test 11: Long strings
runTest("Long strings handled correctly", () => {
  const data = {
    clientName: "Very Long Client Name That Spans Multiple Words And Could Be Problematic",
    botGoal: "Complex multi-step appointment booking with various validation rules"
  };

  const output = generateCode(data);
  assert(output.includes(data.clientName));
  assert(output.includes(data.botGoal));
});

console.log("\n" + "=".repeat(50));
console.log(`Tests completed: ${testsPassed} passed, ${testsFailed} failed`);

if (testsFailed > 0) {
  process.exit(1);
}
