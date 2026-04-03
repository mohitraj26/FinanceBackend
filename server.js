require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db');
const { env } = require('./src/config/env');

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
