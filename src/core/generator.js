import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache compiled templates (functions) in memory
const templateCache = new Map();

function compileTemplate(templateContent) {
  // Pre-split the template into static parts and keys
  // This avoids running regex replace on every generation
  // The regex capturing group ensures keys are included in the split array at odd indices
  const parts = templateContent.split(/{{(CLIENT_NAME|BOT_GOAL)}}/g);

  return (data) => {
    // Reconstruct string by concatenating parts
    let result = '';
    const len = parts.length;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      // Even indices are static text, odd indices are keys
      if (i % 2 === 1) {
        if (part === 'CLIENT_NAME') {
          result += data.clientName;
        } else if (part === 'BOT_GOAL') {
          result += data.botGoal;
        } else {
          // Fallback if regex matched something else (shouldn't happen with current regex)
          result += part;
        }
      } else {
        result += part;
      }
    }
    return result;
  };
}

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let templateFn;
  if (templateCache.has(templatePath)) {
    templateFn = templateCache.get(templatePath);
  } else {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    templateFn = compileTemplate(templateContent);
    templateCache.set(templatePath, templateFn);
  }

  return templateFn(data);
}
