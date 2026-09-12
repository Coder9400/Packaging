import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Synapse API running on http://localhost:${PORT}`);
  console.log(`📡 Registration endpoint: http://localhost:${PORT}/api/auth/register`);
  console.log(`🏥 Health check endpoint: http://localhost:${PORT}/api/health`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
