import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache compiled templates (closures) in memory
const templateCache = new Map();

function compileTemplate(templateContent) {
  const parts = [];
  let lastIndex = 0;
  const regex = /{{(CLIENT_NAME|BOT_GOAL)}}/g;
  let match;

  while ((match = regex.exec(templateContent)) !== null) {
    if (match.index > lastIndex) {
      parts.push(templateContent.slice(lastIndex, match.index));
    }
    const key = match[1];
    if (key === 'CLIENT_NAME') {
      parts.push(data => data.clientName);
    } else if (key === 'BOT_GOAL') {
      parts.push(data => data.botGoal);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < templateContent.length) {
    parts.push(templateContent.slice(lastIndex));
  }

  return (data) => {
    let result = '';
    for (const part of parts) {
      if (typeof part === 'function') {
        result += part(data);
      } else {
        result += part;
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
    render = compileTemplate(templateContent);
    templateCache.set(templatePath, render);
  }

  return render(data);
}
