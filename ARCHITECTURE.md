# Serene - System Architecture

## Overview

Serene is a Next.js web application that provides AI-powered therapeutic assistance with voice capabilities, user authentication, and subscription management.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  React Components                     │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │  │
│  │  │   Chat UI   │ │  Voice UI   │ │ Subscription UI │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Server                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    API Routes                         │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │  │
│  │  │  Chat API   │ │  Voice API  │ │  Payment API    │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Firebase      │  │   ElevenLabs    │  │     Stripe      │
│ Authentication  │  │  Text-to-Speech │  │   Payments      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Component Breakdown

### Frontend (React/Next.js)

1. **Authentication Components**
   - LoginComponent: Email/password and Google login
   - SignupComponent: User registration

2. **Chat Components**
   - ChatInterface: Main conversation UI
   - Message bubbles with animations

3. **Voice Components**
   - VoiceControls: Voice settings and toggle
   - Audio playback integration

4. **Payment Components**
   - SubscriptionPlans: Plan selection UI

### Backend (Next.js API Routes)

1. **Chat API (`/api/chat`)**
   - Processes user messages
   - Returns therapeutic responses

2. **Voice API (`/api/voice`)**
   - Converts text to speech using ElevenLabs
   - Returns audio streams

3. **Payment API (`/api/payment`)**
   - Checkout: Creates Stripe sessions
   - Webhook: Handles Stripe events

## Data Flow

1. **User Authentication**
   ```
   User → LoginComponent → Firebase Auth → Authenticated Session
   ```

2. **Chat Interaction**
   ```
   User Message → ChatInterface → Chat API → Therapeutic Response → UI
   ```

3. **Voice Synthesis**
   ```
   Text → Voice API → ElevenLabs → Audio Stream → Browser Playback
   ```

4. **Payment Processing**
   ```
   Plan Selection → Payment API → Stripe Checkout → Webhook Confirmation
   ```

## Security Considerations

1. **API Keys**
   - Sensitive keys stored in environment variables
   - Server-side only APIs for secret key operations

2. **User Data**
   - Firebase Authentication for secure user management
   - Encrypted communication (HTTPS)

3. **Payment Security**
   - Stripe handles all payment processing
   - PCI compliance through Stripe

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Next.js App                        │  │
│  │  Static Assets + Serverless Functions (API Routes)    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Firebase      │  │   ElevenLabs    │  │     Stripe      │
│ Authentication  │  │  Cloud Services │  │   Cloud Services│
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Scalability Considerations

1. **Serverless Architecture**
   - Automatic scaling with Vercel
   - Pay-per-use pricing model

2. **Caching**
   - Redis for session caching (future enhancement)
   - CDN for static assets

3. **Database**
   - Firebase Firestore for user data (current)
   - Potential migration to PostgreSQL (future)

## Monitoring & Analytics

1. **Error Tracking**
   - Sentry integration (planned)

2. **Performance Monitoring**
   - Vercel Analytics (built-in)

3. **User Analytics**
   - Mixpanel/Amplitude (planned)