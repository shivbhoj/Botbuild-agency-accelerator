import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache templates in memory
const templateCache = new Map();

export function generateCode(data) {
  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let templateContent;
  if (templateCache.has(templatePath)) {
    templateContent = templateCache.get(templatePath);
  } else {
    templateContent = fs.readFileSync(templatePath, 'utf-8');
    templateCache.set(templatePath, templateContent);
  }

  // Simple string replacement
  templateContent = templateContent.replace(/{{CLIENT_NAME}}/g, data.clientName);
  templateContent = templateContent.replace(/{{BOT_GOAL}}/g, data.botGoal);

  return templateContent;
}
