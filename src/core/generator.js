import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache templates in memory
const templateCache = new Map();

const KEY_MAPPING = {
  'CLIENT_NAME': 'clientName',
  'BOT_GOAL': 'botGoal'
};

function compileTemplate(templateString) {
  const parts = [];
  let lastIndex = 0;
  const regex = /{{([A-Z_]+)}}/g;
  let match;

  while ((match = regex.exec(templateString)) !== null) {
    // Add static part before the match
    if (match.index > lastIndex) {
      parts.push(templateString.substring(lastIndex, match.index));
    }
    // Add the key (without braces)
    parts.push({ key: match[1] });
    lastIndex = regex.lastIndex;
  }
  // Add remaining static part
  if (lastIndex < templateString.length) {
    parts.push(templateString.substring(lastIndex));
  }
  return parts;
}

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let compiledTemplate;
  if (templateCache.has(templatePath)) {
    compiledTemplate = templateCache.get(templatePath);
  } else {
    const fileContent = fs.readFileSync(templatePath, 'utf-8');
    compiledTemplate = compileTemplate(fileContent);
    templateCache.set(templatePath, compiledTemplate);
  }

  let result = '';
  for (let i = 0; i < compiledTemplate.length; i++) {
    const part = compiledTemplate[i];
    if (typeof part === 'string') {
      result += part;
    } else {
      const dataKey = KEY_MAPPING[part.key];
      result += (data[dataKey] || '');
    }
  }
  return result;
}
