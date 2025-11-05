# 🚀 Deployment Guide - Therapeutic AI Assistant

This guide will walk you through deploying your Therapeutic AI Assistant to production.

## 📋 Prerequisites

- [x] Node.js 18+ installed
- [x] npm or yarn package manager
- [x] Docker Desktop (for TTS service)
- [x] Firebase account
- [x] Stripe account
- [x] Upstash Redis account (for rate limiting)
- [x] Domain name purchased

## 🔧 Quick Start

1. **Run the automated setup:**
   ```bash
   chmod +x scripts/setup-production.sh
   ./scripts/setup-production.sh
   ```

2. **Validate your setup:**
   ```bash
   chmod +x scripts/deploy-check.sh
   ./scripts/deploy-check.sh
   ```

3. **If all checks pass, proceed to deployment section below.**

## 🔐 Security Features Implemented

### ✅ **Rate Limiting**
- Chat API: 20 requests/minute per user
- Voice API: 10 requests/minute per user
- Auth endpoints: 5 requests/5 minutes per IP
- Payment API: 3 requests/minute per user

### ✅ **Security Headers**
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- X-XSS-Protection

### ✅ **Input Sanitization**
- DOMPurify integration
- Zod validation with sanitization
- XSS prevention
- SQL injection protection

### ✅ **CORS Configuration**
- Configurable allowed origins
- Proper preflight handling
- Credential support

## 🛠️ Manual Setup Steps

### Step 1: Environment Configuration

1. **Copy environment template:**
   ```bash
   cp .env.production.template .env.local
   ```

2. **Fill in your API keys in `.env.local`:**

   **Firebase (Required):**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

   **Stripe (Required):**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # Use LIVE keys for production
   STRIPE_SECRET_KEY=sk_live_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

   **Upstash Redis (Required for rate limiting):**
   ```env
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxx
   ```

   **Domain Configuration:**
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

### Step 2: Firebase Setup

1. **Update Firebase authorized domains:**
   - Go to Firebase Console → Authentication → Settings
   - Add your domain to "Authorized domains"

2. **Configure Firestore security rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### Step 3: Stripe Setup

1. **Create products and prices in Stripe Dashboard**
2. **Configure webhook endpoint:**
   - URL: `https://yourdomain.com/api/payment/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`

### Step 4: TTS Service Deployment

**Option A: Co-located with app (simplest)**
```bash
export COQUI_TOS_AGREED=1
docker-compose -f docker-compose.tts.yml up -d
```

**Option B: Separate server**
- Deploy TTS service to dedicated server
- Update `XTTS_API_URL` in environment variables

### Step 5: Build and Test

```bash
npm install
npm run build
npm run test  # Optional: run tests
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect repository:**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository

2. **Configure environment variables:**
   - Copy all variables from `.env.local` to Vercel dashboard
   - Go to Project Settings → Environment Variables

3. **Configure custom domain:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Self-Hosted

1. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

2. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm -- start
   pm2 startup
   pm2 save
   ```

3. **Configure reverse proxy (Nginx example):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl;
       server_name yourdomain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔍 Post-Deployment Testing

### Critical Tests

1. **Authentication Flow:**
   - Sign up with email/password
   - Login with Google
   - Password reset

2. **Payment Flow:**
   - Subscribe to premium plan
   - Payment success/failure handling
   - Webhook delivery

3. **Chat Functionality:**
   - Send messages
   - Receive AI responses
   - Rate limiting kicks in after limits

4. **Voice Synthesis:**
   - Generate voice from text
   - Different voice options work
   - Audio playback in browser

5. **Security Headers:**
   - Check with [Security Headers](https://securityheaders.com/)
   - Verify CSP is not blocking resources

### Testing Commands

```bash
# Test rate limiting
curl -X POST https://yourdomain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' \
  --rate 30/m  # Should trigger rate limit

# Test security headers
curl -I https://yourdomain.com/

# Test TTS service
curl -X POST https://yourdomain.com/api/voice \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voiceId":"female-1"}'
```

## 📊 Monitoring Setup

### Error Tracking (Recommended)

1. **Sentry:**
   ```env
   SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```

2. **Vercel Analytics:**
   - Automatically enabled on Vercel Pro plan

### Uptime Monitoring

1. **UptimeRobot** (free): https://uptimerobot.com/
2. **Pingdom**: https://pingdom.com/

### Performance Monitoring

1. **Vercel Speed Insights**
2. **Google PageSpeed Insights**
3. **Web.dev Measure**

## 🚨 Troubleshooting

### Common Issues

**1. Build Fails:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**2. CORS Errors:**
- Check `ALLOWED_ORIGINS` in `.env.local`
- Verify middleware configuration
- Check browser developer tools

**3. Rate Limiting Not Working:**
- Verify Upstash Redis credentials
- Check Redis connection in logs
- Ensure middleware is running

**4. TTS Service Not Responding:**
```bash
# Check TTS service status
docker ps | grep xtts

# Check TTS logs
docker-compose -f docker-compose.tts.yml logs -f

# Restart TTS service
docker-compose -f docker-compose.tts.yml restart
```

**5. Firebase Auth Issues:**
- Check authorized domains in Firebase Console
- Verify API keys are correct
- Check browser network tab for errors

### Performance Issues

**Large Bundle Size:**
```bash
# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

**Slow API Responses:**
- Check database query performance
- Implement caching for frequent requests
- Optimize AI model inference

## 📈 Scaling Considerations

### Traffic Growth
- **Vercel:** Automatically scales serverless functions
- **Self-hosted:** Use load balancer + multiple instances
- **Database:** Consider migrating from Firebase to PostgreSQL
- **TTS:** Deploy multiple TTS instances with load balancer

### Cost Optimization
- Monitor Vercel/Firebase usage
- Implement response caching
- Optimize bundle size
- Use CDN for static assets

## 🔒 Security Maintenance

### Regular Tasks
- [ ] Update dependencies monthly: `npm audit fix`
- [ ] Rotate API keys quarterly
- [ ] Review security headers annually
- [ ] Monitor error logs weekly
- [ ] Check uptime monitoring alerts

### Security Checklist
- [ ] All dependencies up to date
- [ ] No critical security vulnerabilities
- [ ] Rate limiting functioning
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Input sanitization working
- [ ] Error messages don't leak info

## 📞 Support

If you encounter issues:

1. **Check logs:** Vercel dashboard or server logs
2. **Run deployment check:** `./scripts/deploy-check.sh`
3. **Review environment variables**
4. **Test individual components**

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ All API endpoints respond correctly
- ✅ Authentication flow works end-to-end  
- ✅ Payment processing completes successfully
- ✅ Voice synthesis generates audio
- ✅ Rate limiting prevents abuse
- ✅ Security headers are present
- ✅ No critical errors in logs
- ✅ Performance metrics are acceptable

**Congratulations! Your Therapeutic AI Assistant is now live! 🚀**