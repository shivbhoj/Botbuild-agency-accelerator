import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache templates in memory
const templateCache = new Map();

/**
 * Generates code from template by replacing placeholders with provided data.
 * @param {Object} data - The data object containing client information
 * @param {string} data.clientName - The name of the client
 * @param {string} data.botGoal - The goal of the bot
 * @returns {string} The generated code with placeholders replaced
 * @throws {Error} If data is invalid or template cannot be read
 */
export function generateCode(data) {
  // Input validation
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data: data must be a non-null object');
  }
  
  if (!data.clientName || typeof data.clientName !== 'string') {
    throw new Error('Invalid data: clientName must be a non-empty string');
  }
  
  if (!data.botGoal || typeof data.botGoal !== 'string') {
    throw new Error('Invalid data: botGoal must be a non-empty string');
  }

  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let templateContent;
  try {
    if (templateCache.has(templatePath)) {
      templateContent = templateCache.get(templatePath);
    } else {
      templateContent = fs.readFileSync(templatePath, 'utf-8');
      templateCache.set(templatePath, templateContent);
    }
  } catch (error) {
    throw new Error(`Failed to read template file: ${error.message}`);
  }

  // Safe string replacement: escape special regex characters and replace in order
  // to avoid double replacement issues
  const clientNameEscaped = data.clientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const botGoalEscaped = data.botGoal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  templateContent = templateContent.replace(/{{CLIENT_NAME}}/g, clientNameEscaped);
  templateContent = templateContent.replace(/{{BOT_GOAL}}/g, botGoalEscaped);

  return templateContent;
}
