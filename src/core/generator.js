import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache templates in memory
const templateCache = new Map();

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let templateParts;
  if (templateCache.has(templatePath)) {
    templateParts = templateCache.get(templatePath);
  } else {
    const content = fs.readFileSync(templatePath, 'utf-8');
    // Pre-split the template into static parts and keys
    // Capturing group ensures keys are included in the array
    templateParts = content.split(/{{(CLIENT_NAME|BOT_GOAL)}}/);
    templateCache.set(templatePath, templateParts);
  }

  // Fast reconstruction using pre-split parts
  // Odd indices are keys, even indices are static content
  let result = '';
  const len = templateParts.length;
  for (let i = 0; i < len; i++) {
    if (i % 2 === 1) {
      const key = templateParts[i];
      if (key === 'CLIENT_NAME') {
        result += data.clientName;
      } else if (key === 'BOT_GOAL') {
        result += data.botGoal;
      } else {
        result += key;
      }
    } else {
      result += templateParts[i];
    }
  }

  return result;
}
