#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Running Homigo Backend Test Suite...\n');

// Set test environment
process.env.NODE_ENV = 'test';

const runTests = () => {
  const jest = spawn('npx', ['jest', '--verbose', '--coverage'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    shell: true
  });

  jest.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ All tests passed!');
    } else {
      console.log('\n❌ Some tests failed.');
      process.exit(code);
    }
  });

  jest.on('error', (error) => {
    console.error('Error running tests:', error);
    process.exit(1);
  });
};

runTests();
