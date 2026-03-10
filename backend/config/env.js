const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];

function getEnv(key, defaultValue) {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined || value === null || value === '') {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}

function validateEnv() {
  // Allow tests to run with looser requirements if needed
  const isTest = process.env.NODE_ENV === 'test';

  requiredEnv.forEach((key) => {
    if (!process.env[key] && !isTest) {
      throw new Error(`Environment variable ${key} is required`);
    }
  });
}

validateEnv();

module.exports = {
  getEnv,
};

