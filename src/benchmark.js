import { generateCode } from './core/generator.js';
import { performance } from 'perf_hooks';

const ITERATIONS = 1000;
const data = {
  clientName: "Radiant Smiles Dental Clinic",
  botGoal: "Appointment Booking"
};

console.log(`Starting benchmark: ${ITERATIONS} iterations...`);

const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
  generateCode(data);
}

const end = performance.now();
const duration = end - start;

console.log(`Total time: ${duration.toFixed(2)}ms`);
console.log(`Average time per iteration: ${(duration / ITERATIONS).toFixed(4)}ms`);
