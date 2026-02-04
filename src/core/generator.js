import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache templates in memory
const templateCache = new Map();

function compileTemplate(content) {
  const parts = content.split(/({{CLIENT_NAME}}|{{BOT_GOAL}})/);
  return parts.map(part => {
    if (part === '{{CLIENT_NAME}}') return { type: 'key', val: 'clientName' };
    if (part === '{{BOT_GOAL}}') return { type: 'key', val: 'botGoal' };
    return { type: 'static', val: part };
  });
}

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let compiledTemplate;
  if (templateCache.has(templatePath)) {
    compiledTemplate = templateCache.get(templatePath);
  } else {
    const content = fs.readFileSync(templatePath, 'utf-8');
    compiledTemplate = compileTemplate(content);
    templateCache.set(templatePath, compiledTemplate);
  }

  // Optimized string reconstruction
  let result = '';
  for (let i = 0; i < compiledTemplate.length; i++) {
    const part = compiledTemplate[i];
    if (part.type === 'key') {
      result += data[part.val];
    } else {
      result += part.val;
    }
  }

  return result;
}
