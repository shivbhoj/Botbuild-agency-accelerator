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
  let lastIndex = 0;
  const regex = /{{([A-Z_]+)}}/g;
  let match;

  const codeParts = [];

  while ((match = regex.exec(templateString)) !== null) {
    if (match.index > lastIndex) {
      codeParts.push(JSON.stringify(templateString.substring(lastIndex, match.index)));
    }

    const key = match[1];
    const dataKey = KEY_MAPPING[key];

    // Optimization: Resolve dataKey at compile time
    if (dataKey) {
       codeParts.push(`(data['${dataKey}'] || '')`);
    } else {
       // If key not found, output empty string (matching previous behavior)
       codeParts.push(`''`);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < templateString.length) {
    codeParts.push(JSON.stringify(templateString.substring(lastIndex)));
  }

  if (codeParts.length === 0) {
    return () => "";
  }

  // Optimization: Compile to Function to avoid runtime loop and lookups
  const functionBody = "return " + codeParts.join(" + ") + ";";
  return new Function('data', functionBody);
}

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let compiledTemplateFn;
  if (templateCache.has(templatePath)) {
    compiledTemplateFn = templateCache.get(templatePath);
  } else {
    const fileContent = fs.readFileSync(templatePath, 'utf-8');
    compiledTemplateFn = compileTemplate(fileContent);
    templateCache.set(templatePath, compiledTemplateFn);
  }

  return compiledTemplateFn(data);
}
