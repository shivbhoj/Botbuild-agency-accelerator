import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache templates in memory
const templateCache = new Map();

/**
 * Compiles a template string into an array of static parts and dynamic keys.
 * This avoids repeated regex parsing during generation.
 */
function compileTemplate(templateString) {
  // Split by the known placeholders, capturing them.
  const parts = templateString.split(/({{CLIENT_NAME}}|{{BOT_GOAL}})/);
  return parts.map(part => {
    if (part === '{{CLIENT_NAME}}') return { type: 'key', value: 'clientName' };
    if (part === '{{BOT_GOAL}}') return { type: 'key', value: 'botGoal' };
    return { type: 'text', value: part };
  });
}

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let compiledTemplate;
  if (templateCache.has(templatePath)) {
    compiledTemplate = templateCache.get(templatePath);
  } else {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    compiledTemplate = compileTemplate(templateContent);
    templateCache.set(templatePath, compiledTemplate);
  }

  // Optimization: Concatenate parts instead of using String.replace
  let result = '';
  const len = compiledTemplate.length;
  for (let i = 0; i < len; i++) {
    const part = compiledTemplate[i];
    if (part.type === 'key') {
      result += data[part.value];
    } else {
      result += part.value;
    }
  }

  return result;
}
