module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.js', '!src/scripts/**'],
  setupFiles: ['dotenv/config']
};
