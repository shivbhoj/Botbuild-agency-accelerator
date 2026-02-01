import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache compiled template functions in memory
const templateCache = new Map();

/**
 * Compiles a template string into a render function.
 * Splits by {{KEY}} and creates a closure that concatenates parts.
 * This avoids repeated regex parsing during generation.
 */
function compile(templateContent) {
  // Split by {{...}} capturing the key
  // Result: [text, key, text, key, text...]
  const parts = templateContent.split(/{{(.*?)}}/g);

  return (data) => {
    let result = '';
    for (let i = 0; i < parts.length; i++) {
      // Odd indices are keys from the regex capture group
      if (i % 2 === 1) {
        const key = parts[i];
        if (key === 'CLIENT_NAME') {
          result += data.clientName;
        } else if (key === 'BOT_GOAL') {
          result += data.botGoal;
        } else {
          // Preserve unknown keys
          result += `{{${key}}}`;
        }
      } else {
        // Even indices are static text
        result += parts[i];
      }
    }
    return result;
  };
}

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let render;
  if (templateCache.has(templatePath)) {
    render = templateCache.get(templatePath);
  } else {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    render = compile(templateContent);
    templateCache.set(templatePath, render);
  }

  return render(data);
}
