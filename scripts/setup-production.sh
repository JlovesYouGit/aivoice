#!/bin/bash

# Production Setup Script
# Automates the setup of production environment

set -e

echo "🏭 Therapeutic AI Assistant - Production Setup"
echo "==============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    error "Don't run this script as root"
    exit 1
fi

echo -e "${BLUE}1. Setting up environment files...${NC}"
echo "----------------------------------------"

# Create .env.local from template if it doesn't exist
if [ ! -f ".env.local" ]; then
    if [ -f ".env.production.template" ]; then
        cp .env.production.template .env.local
        success "Created .env.local from template"
        warning "Please edit .env.local and fill in your actual API keys"
    else
        error ".env.production.template not found"
        exit 1
    fi
else
    info ".env.local already exists"
fi

echo -e "\n${BLUE}2. Installing dependencies...${NC}"
echo "----------------------------------------"

# Clean install
if [ -d "node_modules" ]; then
    info "Cleaning existing node_modules"
    rm -rf node_modules package-lock.json
fi

npm install
success "Dependencies installed"

echo -e "\n${BLUE}3. Building project...${NC}"
echo "----------------------------------------"

npm run build
success "Project built successfully"

echo -e "\n${BLUE}4. Setting up TTS service...${NC}"
echo "----------------------------------------"

# Check if Docker is available
if command -v docker >/dev/null 2>&1; then
    # Check if TTS service is already running
    if docker ps | grep -q "xtts"; then
        info "TTS service already running"
    else
        # Set environment variable for Coqui TOS
        export COQUI_TOS_AGREED=1
        
        # Start TTS service
        if [ -f "docker-compose.tts.yml" ]; then
            docker-compose -f docker-compose.tts.yml up -d
            success "TTS service started"
            
            # Wait for service to be ready
            info "Waiting for TTS service to be ready..."
            sleep 30
            
            # Test TTS service
            if curl -f http://localhost:8000 >/dev/null 2>&1; then
                success "TTS service is responding"
            else
                warning "TTS service may not be fully ready yet"
            fi
        else
            error "docker-compose.tts.yml not found"
        fi
    fi
else
    warning "Docker not found. TTS service setup skipped."
    info "Install Docker and run: docker-compose -f docker-compose.tts.yml up -d"
fi

echo -e "\n${BLUE}5. Security setup...${NC}"
echo "----------------------------------------"

# Generate JWT secret if not exists
if ! grep -q "JWT_SECRET=" .env.local || grep -q "your_random_secure_secret" .env.local; then
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env.local
    success "Generated JWT secret"
fi

# Generate encryption key if not exists
if ! grep -q "ENCRYPTION_KEY=" .env.local || grep -q "another_secure_key" .env.local; then
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env.local
    success "Generated encryption key"
fi

echo -e "\n${BLUE}6. Database setup (if needed)...${NC}"
echo "----------------------------------------"

# Check if using external database
if grep -q "DATABASE_URL=postgresql" .env.local; then
    info "PostgreSQL database detected in configuration"
    warning "Make sure your database is set up and migrations are run"
else
    info "Using Firebase (no additional database setup needed)"
fi

echo -e "\n${BLUE}7. SSL Certificate setup...${NC}"
echo "----------------------------------------"

info "For production, ensure you have:"
echo "  • Custom domain purchased and configured"
echo "  • DNS pointing to your deployment platform"
echo "  • SSL certificate (automatic with Vercel/Netlify)"

echo -e "\n${BLUE}8. Monitoring setup...${NC}"
echo "----------------------------------------"

# Check if Sentry is configured
if grep -q "SENTRY_DSN=https://" .env.local; then
    success "Sentry error monitoring configured"
else
    warning "Consider setting up Sentry for error monitoring"
fi

echo -e "\n${BLUE}9. Performance optimization...${NC}"
echo "----------------------------------------"

# Optimize images if any exist
if [ -d "public" ] && find public -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" | grep -q .; then
    info "Consider optimizing images in public/ directory"
fi

# Check bundle size
BUNDLE_SIZE=$(du -sh .next/static 2>/dev/null | cut -f1 || echo "unknown")
info "Bundle size: $BUNDLE_SIZE"

echo -e "\n${BLUE}10. Final security audit...${NC}"
echo "----------------------------------------"

# Run npm audit
if npm audit --audit-level moderate >/dev/null 2>&1; then
    success "No critical security vulnerabilities"
else
    warning "Security vulnerabilities found. Run 'npm audit fix'"
fi

echo -e "\n${BLUE}11. Deployment preparation...${NC}"
echo "----------------------------------------"

# Create deployment checklist
cat > deployment-checklist.md << EOF
# Deployment Checklist

## Pre-deployment
- [ ] Environment variables configured in .env.local
- [ ] Stripe keys switched from test to live
- [ ] Firebase authorized domains updated
- [ ] TTS service running and accessible
- [ ] Custom domain purchased and DNS configured
- [ ] All tests passing

## Vercel Deployment
- [ ] Connect GitHub repository to Vercel
- [ ] Copy environment variables to Vercel dashboard
- [ ] Configure custom domain in Vercel
- [ ] Enable Vercel Analytics
- [ ] Deploy to production

## Post-deployment
- [ ] Update Stripe webhook URL to production
- [ ] Test payment flow with real card
- [ ] Test authentication flow
- [ ] Test voice synthesis
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

## Security
- [ ] Verify SSL certificate
- [ ] Test security headers
- [ ] Verify rate limiting works
- [ ] Check CSP is not blocking resources
- [ ] Run security scan

## Performance
- [ ] Check Core Web Vitals
- [ ] Verify CDN caching
- [ ] Test mobile responsiveness
- [ ] Monitor bundle size
EOF

success "Created deployment-checklist.md"

echo -e "\n${GREEN}🎉 Production setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit .env.local with your actual API keys"
echo "2. Review and complete deployment-checklist.md"
echo "3. Run './scripts/deploy-check.sh' to validate setup"
echo "4. Deploy to your chosen platform"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "• Never commit .env.local to version control"
echo "• Use live API keys for production"
echo "• Test thoroughly before going live"
echo "• Monitor logs and errors after deployment"