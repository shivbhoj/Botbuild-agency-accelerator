import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache compiled templates in memory
const templateCache = new Map();

function compileTemplate(content) {
  // Split by placeholders, keeping them in the array
  // The regex captures the placeholders so they are included in the split result
  return content.split(/({{CLIENT_NAME}}|{{BOT_GOAL}})/);
}

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let compiledTemplate;
  if (templateCache.has(templatePath)) {
    compiledTemplate = templateCache.get(templatePath);
  } else {
    const rawContent = fs.readFileSync(templatePath, 'utf-8');
    compiledTemplate = compileTemplate(rawContent);
    templateCache.set(templatePath, compiledTemplate);
  }

  // Fast string reconstruction
  // We avoid regex replacement on every call
  return compiledTemplate.map(part => {
    if (part === '{{CLIENT_NAME}}') return data.clientName;
    if (part === '{{BOT_GOAL}}') return data.botGoal;
    return part;
  }).join('');
}
