const { Agenda } = require('agenda');

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI || 'mongodb://localhost:27017/email-sequence' },
  processEvery: '1 minute',
});

// Error handling for Agenda
agenda.on('error', (err) => {
  console.error('Agenda error:', err);
});

// Start Agenda when the server starts
const startAgenda = async () => {
  await agenda.start();
  console.log('Agenda started successfully');
};

module.exports = { agenda, startAgenda }; 