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
  assert(output.includes('agent.add("Okay " + parameters.name + ", I can help you with Teeth Cleaning.");'));
  console.log("✅ Test Passed: Output contains expected strings.");
} catch (e) {
  console.error("❌ Test Failed:", e);
  process.exit(1);
}
