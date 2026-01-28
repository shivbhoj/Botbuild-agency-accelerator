import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimization: Cache templates in memory
const templateCache = new Map();
const MAX_CACHE_SIZE = 100; // Prevent unbounded memory growth

/**
 * Generates code from a template by replacing placeholders with provided data
 * @param {Object} data - The data to inject into the template
 * @param {string} data.clientName - The client's name
 * @param {string} data.botGoal - The goal of the bot
 * @returns {string} The generated code with placeholders replaced
 * @throws {Error} If data is invalid or template file cannot be read
 */
export function generateCode(data) {
  // Input validation
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data parameter: expected an object');
  }
  
  if (!data.clientName || typeof data.clientName !== 'string') {
    throw new Error('Invalid or missing data.clientName: expected a non-empty string');
  }
  
  if (!data.botGoal || typeof data.botGoal !== 'string') {
    throw new Error('Invalid or missing data.botGoal: expected a non-empty string');
  }

  const templatePath = path.join(__dirname, '../templates/appointment_booking.js');

  let templateContent;
  if (templateCache.has(templatePath)) {
    templateContent = templateCache.get(templatePath);
  } else {
    // Error handling for file system operations
    try {
      templateContent = fs.readFileSync(templatePath, 'utf-8');
      
      // Implement cache size limit
      if (templateCache.size >= MAX_CACHE_SIZE) {
        const firstKey = templateCache.keys().next().value;
        templateCache.delete(firstKey);
      }
      
      templateCache.set(templatePath, templateContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Template file not found: ${templatePath}`);
      } else if (error.code === 'EACCES') {
        throw new Error(`Permission denied reading template file: ${templatePath}`);
      }
      throw new Error(`Failed to read template file: ${error.message}`);
    }
  }

  // Safe string replacement - using regex for pattern matching (placeholders)
  // but using the raw data values for replacement (no need to escape replacement text)
  let result = templateContent.replace(/{{CLIENT_NAME}}/g, data.clientName);
  result = result.replace(/{{BOT_GOAL}}/g, data.botGoal);

  return result;
}
