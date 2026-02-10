#!/usr/bin/env node

/**
 * Environment Variable Verification Script
 * Verifies that GEMINI_API_KEY is set correctly
 */

const fs = require('fs');
const path = require('path');

console.log('\n✅ Environment variable verification');
console.log('━'.repeat(40));
console.log('');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env file not found');
  console.log('');
  console.log('Please create a .env file with:');
  console.log('GEMINI_API_KEY=your_api_key_here');
  console.log('');
  console.log('You can copy from .env.example:');
  console.log('  cp .env.example .env');
  console.log('');
  process.exit(1);
}

console.log('✓ .env file exists');

// Load .env file manually (don't use dotenv package)
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
let apiKey = null;

for (const line of envLines) {
  if (line.trim().startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
    break;
  }
}

if (!apiKey) {
  console.log('✗ GEMINI_API_KEY is not set in .env file');
  console.log('');
  console.log('Please add this line to your .env file:');
  console.log('GEMINI_API_KEY=your_actual_api_key_here');
  console.log('');
  console.log('Get your API key from:');
  console.log('https://aistudio.google.com/apikey');
  console.log('');
  process.exit(1);
}

console.log('✓ GEMINI_API_KEY is set');

// Check if it's still the placeholder
if (apiKey === 'your_gemini_api_key_here') {
  console.log('⚠️  GEMINI_API_KEY is still the placeholder value');
  console.log('');
  console.log('Please replace it with your actual API key from:');
  console.log('https://aistudio.google.com/apikey');
  console.log('');
  process.exit(1);
}

// Validate API key format (Google API keys typically start with "AIza")
const keyPrefix = apiKey.substring(0, 4);
const keyLength = apiKey.length;

console.log(`✓ Value starts with: ${keyPrefix}...`);
console.log(`✓ Length: ${keyLength} characters`);

// Basic validation
if (!apiKey.startsWith('AIza')) {
  console.log('');
  console.log('⚠️  Warning: API key doesn\'t start with "AIza"');
  console.log('   Google Gemini API keys typically start with "AIza"');
  console.log('   Make sure you copied the key correctly');
  console.log('');
}

if (keyLength < 30 || keyLength > 50) {
  console.log('');
  console.log('⚠️  Warning: Unexpected key length');
  console.log('   Google API keys are usually 39 characters');
  console.log('   Make sure you copied the complete key');
  console.log('');
}

console.log('');
console.log('━'.repeat(40));
console.log('✅ All checks passed!');
console.log('');
console.log('Your environment is ready for development.');
console.log('');
console.log('Next steps:');
console.log('  1. Run: npm run dev');
console.log('  2. Open: http://localhost:3000');
console.log('  3. Test AI features');
console.log('');
