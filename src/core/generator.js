import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache compiled templates in memory
const templateCache = new Map();

/**
 * Compiles a template string into a reusable function.
 * This avoids repeated regex parsing and string replacement.
 * @param {string} templateContent
 * @returns {function(object): string}
 */
function compileTemplate(templateContent) {
  // Split by specific placeholders.
  // The capturing group (CLIENT_NAME|BOT_GOAL) ensures that the keys are included in the result array at odd indices.
  const parts = templateContent.split(/{{(CLIENT_NAME|BOT_GOAL)}}/g);

  return (data) => {
    let result = '';
    const len = parts.length;
    for (let i = 0; i < len; i++) {
        // Even indices are static parts of the template.
        if (i % 2 === 0) {
            result += parts[i];
        } else {
            // Odd indices are keys.
            const key = parts[i];
            if (key === 'CLIENT_NAME') {
                result += data.clientName;
            } else if (key === 'BOT_GOAL') {
                result += data.botGoal;
            }
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
