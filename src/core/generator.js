import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache compiled templates (functions) in memory
// This avoids repeated regex parsing and string replacement.
const templateCache = new Map();

function compileTemplate(content) {
  const parts = [];
  const vars = [];
  // Regex to find all known placeholders
  const regex = /{{(CLIENT_NAME|BOT_GOAL)}}/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    parts.push(content.slice(lastIndex, match.index));
    vars.push(match[1] === 'CLIENT_NAME' ? 'clientName' : 'botGoal');
    lastIndex = regex.lastIndex;
  }
  parts.push(content.slice(lastIndex));

  return (data) => {
    let result = parts[0];
    for (let i = 0; i < vars.length; i++) {
      result += data[vars[i]] + parts[i + 1];
    }
    return result;
  };
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

  return compiledTemplate(data);
}
