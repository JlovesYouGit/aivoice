#!/bin/bash

# Deployment Readiness Check Script
# This script validates that all requirements are met before deployment

set -e  # Exit on any error

echo "🚀 Therapeutic AI Assistant - Deployment Readiness Check"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${BLUE}1. Checking Development Tools...${NC}"
echo "----------------------------------------"

# Check Node.js version
if command_exists node; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ $MAJOR_VERSION -ge 18 ]; then
        success "Node.js version: $NODE_VERSION (✓ >= 18.0.0)"
    else
        error "Node.js version $NODE_VERSION is too old. Need >= 18.0.0"
    fi
else
    error "Node.js not found"
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    success "npm version: $NPM_VERSION"
else
    error "npm not found"
fi

# Check Docker (for TTS service)
if command_exists docker; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    success "Docker version: $DOCKER_VERSION"
else
    warning "Docker not found - needed for self-hosted TTS service"
fi

# Check if in project directory
if [ ! -f "package.json" ]; then
    error "Not in project directory (package.json not found)"
    exit 1
fi

echo -e "\n${BLUE}2. Checking Project Dependencies...${NC}"
echo "----------------------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    success "Dependencies installed"
else
    error "Dependencies not installed. Run: npm install"
fi

# Check package.json for required dependencies
REQUIRED_DEPS=("@upstash/ratelimit" "@upstash/redis" "dompurify" "zod" "firebase" "stripe")
for dep in "${REQUIRED_DEPS[@]}"; do
    if grep -q "\"$dep\":" package.json; then
        success "Required dependency: $dep"
    else
        error "Missing required dependency: $dep"
    fi
done

echo -e "\n${BLUE}3. Checking Environment Configuration...${NC}"
echo "----------------------------------------"

# Check for environment files
if [ -f ".env.local" ]; then
    success ".env.local file exists"
    
    # Check critical environment variables
    source .env.local 2>/dev/null || true
    
    REQUIRED_VARS=("NEXT_PUBLIC_FIREBASE_API_KEY" "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "STRIPE_SECRET_KEY" "UPSTASH_REDIS_REST_URL")
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -n "${!var}" ]; then
            success "Environment variable: $var"
        else
            error "Missing environment variable: $var"
        fi
    done
    
    # Check if using test vs live keys
    if [[ $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY == pk_test_* ]]; then
        warning "Using Stripe TEST keys (switch to LIVE for production)"
    elif [[ $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY == pk_live_* ]]; then
        success "Using Stripe LIVE keys"
    fi
    
else
    error ".env.local file not found. Copy from .env.production.template"
fi

echo -e "\n${BLUE}4. Checking Project Structure...${NC}"
echo "----------------------------------------"

# Check required directories
REQUIRED_DIRS=("src/app" "src/components" "src/lib" "src/services" "src/utils")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        success "Directory: $dir"
    else
        error "Missing directory: $dir"
    fi
done

# Check critical files
CRITICAL_FILES=("src/middleware.ts" "src/lib/rate-limit.ts" "src/utils/sanitization.ts" "next.config.js" "tsconfig.json")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        success "Critical file: $file"
    else
        error "Missing critical file: $file"
    fi
done

echo -e "\n${BLUE}5. Running Build Test...${NC}"
echo "----------------------------------------"

# Test build
if npm run build >/dev/null 2>&1; then
    success "Build successful"
else
    error "Build failed - check TypeScript errors"
fi

echo -e "\n${BLUE}6. Security Check...${NC}"
echo "----------------------------------------"

# Run security audit
if npm audit --level moderate >/dev/null 2>&1; then
    success "No moderate+ security vulnerabilities"
else
    warning "Security vulnerabilities found - run 'npm audit' for details"
fi

# Check for security headers in next.config.js
if grep -q "X-Frame-Options" next.config.js; then
    success "Security headers configured"
else
    error "Security headers not configured in next.config.js"
fi

echo -e "\n${BLUE}7. TTS Service Check...${NC}"
echo "----------------------------------------"

# Check TTS configuration
if [ -f "docker-compose.tts.yml" ]; then
    success "TTS Docker configuration found"
else
    error "TTS Docker configuration missing"
fi

# Check if TTS environment variables are set
if [ -n "$XTTS_API_URL" ]; then
    success "TTS API URL configured: $XTTS_API_URL"
else
    warning "TTS API URL not configured"
fi

echo -e "\n${BLUE}8. Final Recommendations...${NC}"
echo "----------------------------------------"

# Domain check
if [ -n "$NEXT_PUBLIC_APP_URL" ]; then
    if [[ $NEXT_PUBLIC_APP_URL == *"vercel.app"* ]]; then
        warning "Using Vercel default domain. Consider custom domain for production."
    else
        success "Custom domain configured: $NEXT_PUBLIC_APP_URL"
    fi
else
    error "App URL not configured"
fi

# Rate limiting check
if [ -n "$UPSTASH_REDIS_REST_URL" ]; then
    success "Rate limiting configured with Upstash Redis"
else
    warning "Rate limiting not configured - consider setting up Upstash Redis"
fi

echo -e "\n${BLUE}Summary${NC}"
echo "======="
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Ready for deployment!${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "\n${YELLOW}Consider addressing warnings for optimal production setup.${NC}"
    fi
    
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo "1. Deploy TTS service: docker-compose -f docker-compose.tts.yml up -d"
    echo "2. Deploy to Vercel: vercel --prod"
    echo "3. Configure custom domain in Vercel dashboard"
    echo "4. Update Stripe webhook URL"
    echo "5. Test all functionality in production"
    
    exit 0
else
    echo -e "\n${RED}❌ Not ready for deployment. Please fix the errors above.${NC}"
    exit 1
fi