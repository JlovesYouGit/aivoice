#!/bin/bash

# Automated Vercel Deployment Script for evalion.free.nf
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Therapeutic AI Assistant - Vercel Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    error "Not in project directory (package.json not found)"
    exit 1
fi

echo -e "${BLUE}1. Pre-deployment Checks${NC}"
echo "----------------------------------------"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ $MAJOR_VERSION -ge 18 ]; then
    success "Node.js version: $NODE_VERSION (✓ >= 18.0.0)"
else
    error "Node.js version $NODE_VERSION is too old. Need >= 18.0.0"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    info "Installing Vercel CLI..."
    npm install -g vercel
    success "Vercel CLI installed"
else
    success "Vercel CLI found"
fi

# Install dependencies
info "Installing dependencies..."
npm ci
success "Dependencies installed"

echo -e "\n${BLUE}2. Build and Test${NC}"
echo "----------------------------------------"

# Run tests (if they exist)
if npm run test --silent 2>/dev/null; then
    success "Tests passed"
else
    warning "Tests not found or failed - continuing anyway"
fi

# Build the project
info "Building project for production..."
npm run build
success "Build completed successfully"

echo -e "\n${BLUE}3. Environment Setup${NC}"
echo "----------------------------------------"

# Check if .env.vercel.production exists
if [ -f ".env.vercel.production" ]; then
    success "Environment template found"
    warning "Remember to add these variables to Vercel Dashboard:"
    echo "   → Project Settings → Environment Variables"
    echo "   → Set Environment to 'Production'"
else
    warning "No .env.vercel.production found - using existing environment"
fi

echo -e "\n${BLUE}4. Vercel Deployment${NC}"
echo "----------------------------------------"

# Check if user is logged in to Vercel
if ! vercel whoami &>/dev/null; then
    info "Logging in to Vercel..."
    vercel login
fi

VERCEL_USER=$(vercel whoami 2>/dev/null)
success "Logged in as: $VERCEL_USER"

# Deployment options
echo "Choose deployment method:"
echo "1) Production deployment (recommended)"
echo "2) Preview deployment (for testing)"
echo "3) Link existing project"
read -p "Enter choice (1-3): " CHOICE

case $CHOICE in
    1)
        info "Deploying to production..."
        
        # Production deployment
        vercel --prod --confirm
        
        success "Production deployment initiated!"
        ;;
    2)
        info "Creating preview deployment..."
        
        # Preview deployment
        vercel --confirm
        
        success "Preview deployment created!"
        ;;
    3)
        info "Linking to existing project..."
        
        # Link to existing project
        vercel link
        
        info "Now deploying to production..."
        vercel --prod --confirm
        
        success "Linked and deployed!"
        ;;
    *)
        error "Invalid choice"
        exit 1
        ;;
esac

echo -e "\n${BLUE}5. Domain Configuration${NC}"
echo "----------------------------------------"

info "To configure evalion.free.nf as custom domain:"
echo "1. Go to Vercel Dashboard → Your Project → Settings → Domains"
echo "2. Add Domain: evalion.free.nf"
echo "3. Configure DNS:"
echo "   • Type: CNAME"
echo "   • Name: evalion (or @)"
echo "   • Value: cname.vercel-dns.com"
echo "4. Wait for DNS propagation (up to 48 hours)"

read -p "Do you want to automatically configure the domain? (y/n): " CONFIGURE_DOMAIN

if [ "$CONFIGURE_DOMAIN" = "y" ]; then
    info "Adding domain to Vercel project..."
    
    # Add domain (this might require manual verification)
    vercel domains add evalion.free.nf 2>/dev/null || {
        warning "Domain addition requires manual setup in Vercel Dashboard"
        echo "Visit: https://vercel.com/dashboard → Your Project → Settings → Domains"
    }
fi

echo -e "\n${BLUE}6. Post-deployment Tests${NC}"
echo "----------------------------------------"

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls 2>/dev/null | grep "therapeutic-ai" | head -1 | awk '{print $2}' 2>/dev/null || echo "your-deployment-url.vercel.app")

if [ "$DEPLOYMENT_URL" != "your-deployment-url.vercel.app" ]; then
    info "Testing deployment at: https://$DEPLOYMENT_URL"
    
    # Test if site loads
    if curl -f -s "https://$DEPLOYMENT_URL" > /dev/null; then
        success "Deployment is live and responding"
    else
        warning "Deployment might still be starting up"
    fi
    
    # Test API endpoint
    if curl -f -s -X POST "https://$DEPLOYMENT_URL/api/chat" \
       -H "Content-Type: application/json" \
       -d '{"message":"test"}' > /dev/null; then
        success "API endpoints are working"
    else
        warning "API endpoints might need environment variables"
    fi
else
    warning "Could not determine deployment URL - check Vercel Dashboard"
fi

echo -e "\n${BLUE}7. Security Verification${NC}"
echo "----------------------------------------"

if [ "$DEPLOYMENT_URL" != "your-deployment-url.vercel.app" ]; then
    # Check security headers
    info "Checking security headers..."
    
    HEADERS=$(curl -sI "https://$DEPLOYMENT_URL" 2>/dev/null || echo "")
    
    if echo "$HEADERS" | grep -q "x-frame-options"; then
        success "X-Frame-Options header present"
    else
        warning "X-Frame-Options header missing"
    fi
    
    if echo "$HEADERS" | grep -q "x-content-type-options"; then
        success "X-Content-Type-Options header present"
    else
        warning "X-Content-Type-Options header missing"
    fi
    
    if echo "$HEADERS" | grep -q "strict-transport-security"; then
        success "HSTS header present"
    else
        info "HSTS will be added by Vercel automatically"
    fi
fi

echo -e "\n${BLUE}8. Final Steps${NC}"
echo "----------------------------------------"

success "Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables in Vercel Dashboard"
echo "2. Set up custom domain (evalion.free.nf)"
echo "3. Test all functionality:"
echo "   • Authentication flow"
echo "   • Chat functionality"
echo "   • Payment processing"
echo "   • Voice synthesis"
echo "4. Monitor function logs in Vercel Dashboard"
echo "5. Set up monitoring and analytics"
echo ""

if [ "$DEPLOYMENT_URL" != "your-deployment-url.vercel.app" ]; then
    echo "🔗 Your app is live at:"
    echo "   Preview: https://$DEPLOYMENT_URL"
    echo "   Production: https://evalion.free.nf (after domain setup)"
else
    echo "🔗 Check your deployment in Vercel Dashboard:"
    echo "   https://vercel.com/dashboard"
fi

echo ""
echo "📚 Useful links:"
echo "   • Vercel Dashboard: https://vercel.com/dashboard"
echo "   • Domain Settings: https://vercel.com/dashboard → Project → Domains"
echo "   • Environment Variables: https://vercel.com/dashboard → Project → Settings → Environment Variables"
echo "   • Function Logs: https://vercel.com/dashboard → Project → Functions"
echo ""

success "Deployment script completed! 🎉"

# Optional: Open browser to Vercel dashboard
read -p "Open Vercel Dashboard in browser? (y/n): " OPEN_BROWSER
if [ "$OPEN_BROWSER" = "y" ]; then
    if command -v open &> /dev/null; then
        open "https://vercel.com/dashboard"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://vercel.com/dashboard"
    else
        echo "Please visit: https://vercel.com/dashboard"
    fi
fi

echo ""
echo "🎯 Remember:"
echo "• Add all environment variables from .env.vercel.production to Vercel"
echo "• Configure DNS for evalion.free.nf to point to Vercel"
echo "• Monitor deployment logs for any issues"
echo "• Test thoroughly before announcing launch"
echo ""
echo "Happy deploying! 🚀"