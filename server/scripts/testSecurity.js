import { runSecurityVerification } from '../middleware/authMiddleware.js';

console.log('====================================================');
console.log('🛡️ RUNNING SKILLSWAP SECURITY & AUTH VERIFICATION SUITE');
console.log('====================================================');

const results = await runSecurityVerification();

console.log(`\nTimestamp: ${results.timestamp}`);
console.log(`Hashing Algorithm: ${results.hashingAlgorithm}`);
console.log(`Token Algorithm: ${results.tokenAlgorithm}`);
console.log(`Token Expiry: ${results.tokenExpiry}`);

console.log('\n--- SECURITY TEST CASES ---');
results.tests.forEach(t => {
  const icon = t.status === 'PASSED' ? '✅' : '❌';
  console.log(`${icon} [${t.id}] ${t.title}: ${t.status}`);
  console.log(`   └─ ${t.detail}`);
});

console.log(`\nOverall Security Status: ${results.overallStatus === 'PASSED' ? '✅ PASSED' : '❌ FAILED'}`);
console.log('====================================================\n');

process.exit(results.overallStatus === 'PASSED' ? 0 : 1);
