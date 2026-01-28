export const codeTemplate = `
/**
 * Fulfillment for {{CLIENT_NAME}}
 * Goal: {{BOT_GOAL}}
 */

function handleBooking(agent) {
  const parameters = agent.parameters;
  console.log(\`Handling booking for \${parameters.name}\`);
  // Business logic here
  agent.add(\`Okay \${parameters.name}, I can help you with {{BOT_GOAL}}.\`);
}

export default {
  handleBooking
};
`;
