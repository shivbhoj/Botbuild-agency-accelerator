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
  let funcBody = 'return ';
  let lastIndex = 0;
  const regex = /{{([A-Z_]+)}}/g;
  let match;
  let first = true;

  while ((match = regex.exec(templateString)) !== null) {
    // Add static part before the match
    if (match.index > lastIndex) {
      if (!first) funcBody += ' + ';
      funcBody += JSON.stringify(templateString.substring(lastIndex, match.index));
      first = false;
    }

    // Add the dynamic part
    const key = match[1];
    const dataKey = KEY_MAPPING[key];

    if (!first) funcBody += ' + ';
    if (dataKey) {
        // Use lookup by string key to be safe
        funcBody += `(data["${dataKey}"] || "")`;
    } else {
        funcBody += '""';
    }
    first = false;

    lastIndex = regex.lastIndex;
  }
  // Add remaining static part
  if (lastIndex < templateString.length) {
    if (!first) funcBody += ' + ';
    funcBody += JSON.stringify(templateString.substring(lastIndex));
    first = false;
  }

  if (first) return () => ""; // Empty template

  funcBody += ';';
  return new Function('data', funcBody);
}

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let templateFunc;
  if (templateCache.has(templatePath)) {
    templateFunc = templateCache.get(templatePath);
  } else {
    const fileContent = fs.readFileSync(templatePath, 'utf-8');
    templateFunc = compileTemplate(fileContent);
    templateCache.set(templatePath, templateFunc);
  }

  return templateFunc(data);
}
