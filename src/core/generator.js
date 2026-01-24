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
    // Pre-compile template by splitting into parts
    templateParts = content.split(/({{CLIENT_NAME}}|{{BOT_GOAL}})/g);
    templateCache.set(templatePath, templateParts);
  }

  // Fast string reconstruction from pre-compiled parts
  let result = '';
  for (let i = 0; i < templateParts.length; i++) {
    const part = templateParts[i];
    if (part === '{{CLIENT_NAME}}') {
      result += data.clientName;
    } else if (part === '{{BOT_GOAL}}') {
      result += data.botGoal;
    } else {
      result += part;
    }
  }

  return result;
}
