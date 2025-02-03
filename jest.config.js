module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['./jest.setup.js']
  };

  process.env.NODE_ENV = 'test';
  require('dotenv').config({ path: '.env.test' });
