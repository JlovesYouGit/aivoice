#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Serene - AI Therapeutic Assistant...')

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version').toString().trim()
  console.log(`✅ Node.js version: ${nodeVersion}`)
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.')
  process.exit(1)
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version').toString().trim()
  console.log(`✅ npm version: ${npmVersion}`)
} catch (error) {
  console.error('❌ npm is not installed. Please install npm first.')
  process.exit(1)
}

// Check if package.json exists
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.log('📦 Creating package.json...')
  execSync('npm init -y', { stdio: 'inherit' })
}

// Install dependencies
console.log('📥 Installing dependencies...')
try {
  execSync('npm install next react react-dom firebase stripe @stripe/stripe-js @stripe/react-stripe-js framer-motion elevenlabs-node', { stdio: 'inherit' })
  console.log('✅ Core dependencies installed successfully')
} catch (error) {
  console.error('⚠️ Failed to install core dependencies. You may need to install them manually.')
}

// Install dev dependencies
console.log('📥 Installing development dependencies...')
try {
  execSync('npm install -D typescript @types/node @types/react @types/react-dom autoprefixer postcss tailwindcss eslint eslint-config-next vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths', { stdio: 'inherit' })
  console.log('✅ Development dependencies installed successfully')
} catch (error) {
  console.error('⚠️ Failed to install development dependencies. You may need to install them manually.')
}

// Create required directories
const dirs = [
  'app/api/auth',
  'app/api/chat',
  'app/api/payment',
  'app/api/voice',
  'components/auth',
  'components/chat',
  'components/payment',
  'components/voice',
  '__tests__',
  '.github/workflows'
]

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`📁 Created directory: ${dir}`)
  }
})

// Check if env file exists
const envExamplePath = path.join(__dirname, '.env.example')
const envPath = path.join(__dirname, '.env.local')

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath)
  console.log('📄 Created .env.local from .env.example')
  console.log('⚠️ Please update .env.local with your actual API keys')
}

console.log('\n✨ Setup complete!')
console.log('\nNext steps:')
console.log('1. Update .env.local with your API keys')
console.log('2. Run "npm run dev" to start the development server')
console.log('3. Visit http://localhost:3000 in your browser')

console.log('\n📖 Check out the README.md file for more detailed instructions')