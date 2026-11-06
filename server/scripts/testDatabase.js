import { runDatabaseVerification, connectDB } from '../config/db.js';

console.log('====================================================');
console.log('🧪 RUNNING SKILLSWAP DATABASE VERIFICATION SUITE');
console.log('====================================================');

await connectDB();
const results = await runDatabaseVerification();

console.log(`\nTimestamp: ${results.timestamp}`);
console.log(`Connection Mode: ${results.connectionMode}`);
console.log(`Is Mongo Live: ${results.isMongoConnected}`);
console.log(`Registered Mongoose Schemas: ${results.schemas.map(s => s.name).join(', ')}`);

console.log('\n--- VERIFICATION TEST CASES ---');
results.tests.forEach(t => {
  const icon = t.status === 'PASSED' ? '✅' : '❌';
  console.log(`${icon} [${t.id}] ${t.title}: ${t.status}`);
  console.log(`   └─ ${t.detail}`);
});

console.log(`\nOverall Database Health: ${results.overallStatus === 'PASSED' ? '✅ PASSED' : '❌ FAILED'}`);
console.log('====================================================\n');

process.exit(results.overallStatus === 'PASSED' ? 0 : 1);
