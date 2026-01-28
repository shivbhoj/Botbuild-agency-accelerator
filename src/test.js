import { generateCode } from './core/generator.js';
import assert from 'assert';

const data = {
  clientName: "Test Clinic",
  botGoal: "Teeth Cleaning"
};

const output = generateCode(data);

console.log("Output Preview:");
console.log(output);

try {
  assert(output.includes("Fulfillment for Test Clinic"));
  assert(output.includes("Goal: Teeth Cleaning"));
  // Template literals are escaped in the template file (this is intentional for code generation)
  assert(output.includes('console.log(\\`Handling booking for \\${parameters.name}\\`);'));
  assert(output.includes('agent.add(\\`Okay \\${parameters.name}, I can help you with Teeth Cleaning.\\`);'));
  console.log("✅ Test Passed: Output contains expected strings.");
} catch (e) {
  console.error("❌ Test Failed:", e);
  process.exit(1);
}

// Test error handling
console.log("\nTesting error handling...");

// Test with null data
try {
  generateCode(null);
  console.error("❌ Test Failed: Should throw error for null data");
  process.exit(1);
} catch (e) {
  assert(e.message.includes("Invalid data"));
  console.log("✅ Test Passed: Correctly throws error for null data");
}

// Test with missing clientName
try {
  generateCode({ botGoal: "Test" });
  console.error("❌ Test Failed: Should throw error for missing clientName");
  process.exit(1);
} catch (e) {
  assert(e.message.includes("clientName"));
  console.log("✅ Test Passed: Correctly throws error for missing clientName");
}

// Test with missing botGoal
try {
  generateCode({ clientName: "Test" });
  console.error("❌ Test Failed: Should throw error for missing botGoal");
  process.exit(1);
} catch (e) {
  assert(e.message.includes("botGoal"));
  console.log("✅ Test Passed: Correctly throws error for missing botGoal");
}

// Test with empty string clientName
try {
  generateCode({ clientName: "", botGoal: "Test" });
  console.error("❌ Test Failed: Should throw error for empty clientName");
  process.exit(1);
} catch (e) {
  assert(e.message.includes("clientName"));
  console.log("✅ Test Passed: Correctly throws error for empty clientName");
}

// Test with empty string botGoal
try {
  generateCode({ clientName: "Test", botGoal: "" });
  console.error("❌ Test Failed: Should throw error for empty botGoal");
  process.exit(1);
} catch (e) {
  assert(e.message.includes("botGoal"));
  console.log("✅ Test Passed: Correctly throws error for empty botGoal");
}

// Test with whitespace-only strings
try {
  generateCode({ clientName: "   ", botGoal: "Test" });
  console.error("❌ Test Failed: Should throw error for whitespace-only clientName");
  process.exit(1);
} catch (e) {
  assert(e.message.includes("clientName"));
  console.log("✅ Test Passed: Correctly throws error for whitespace-only clientName");
}

// Test with special characters in data
console.log("\nTesting special characters...");
const specialCharsData = {
  clientName: "Test (Clinic) & More",
  botGoal: "Appointment $100"
};

const specialOutput = generateCode(specialCharsData);
assert(specialOutput.includes("Fulfillment for Test (Clinic) & More"));
assert(specialOutput.includes("Goal: Appointment $100"));
assert(specialOutput.includes('agent.add(\\`Okay \\${parameters.name}, I can help you with Appointment $100.\\`);'));
console.log("✅ Test Passed: Special characters handled correctly");

console.log("\n✅ All tests passed!");

