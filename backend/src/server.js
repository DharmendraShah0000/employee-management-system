const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');

(async () => {
  try {
    if (!env.jwtSecret) throw new Error('JWT_SECRET is not defined');
    await connectDB(env.mongoUri);
    app.listen(env.port, () => console.log(`API running on port ${env.port} (${env.nodeEnv})`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
