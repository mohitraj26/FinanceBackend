const isTest = process.env.NODE_ENV === 'test';
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

if (!isTest) {
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance_dashboard_test',
  jwtSecret: process.env.JWT_SECRET || 'test-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
};

module.exports = { env };
