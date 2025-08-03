#!/usr/bin/env node

/**
 * Database Setup and Migration Script
 * 
 * This script helps set up MongoDB for the IndustrialCo platform.
 * Run with: node scripts/setup-database.js
 */

import { connectToDatabase, initializeDatabase, getDatabaseStatus } from '../server/database/connection.js';
import { resetDatabase } from '../server/database/migration.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('🚀 IndustrialCo Database Setup');
  console.log('================================\n');

  try {
    // Connect to database
    console.log('📦 Connecting to MongoDB...');
    await connectToDatabase();
    
    const status = getDatabaseStatus();
    console.log(`✅ Connected to MongoDB: ${status.name} (${status.host})\n`);

    // Check what the user wants to do
    console.log('Choose an option:');
    console.log('1. Initialize database with default data (recommended for new installations)');
    console.log('2. Reset database (WARNING: This will delete ALL data)');
    console.log('3. Check database status');
    console.log('4. Exit\n');

    const choice = await question('Enter your choice (1-4): ');

    switch (choice) {
      case '1':
        console.log('\n🔄 Initializing database with default data...');
        await initializeDatabase();
        console.log('✅ Database initialization completed!');
        break;

      case '2':
        const confirm = await question('\n⚠️  Are you sure you want to reset the database? This will DELETE ALL DATA! (type "yes" to confirm): ');
        if (confirm.toLowerCase() === 'yes') {
          console.log('🔄 Resetting database...');
          await resetDatabase();
          console.log('✅ Database reset completed!');
        } else {
          console.log('❌ Database reset cancelled.');
        }
        break;

      case '3':
        const { checkDatabaseHealth } = await import('../server/database/connection.js');
        const health = await checkDatabaseHealth();
        console.log('\n📊 Database Status:');
        console.log(`Status: ${health.status}`);
        console.log(`Message: ${health.message}`);
        if (health.details) {
          console.log('Details:', health.details);
        }
        break;

      case '4':
        console.log('👋 Goodbye!');
        break;

      default:
        console.log('❌ Invalid choice. Please run the script again.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
