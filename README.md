# Serene - AI Therapeutic Assistant

A compassionate AI assistant for mental wellness and emotional support, built with Next.js, Firebase, Stripe, and ElevenLabs.

## Features

- **Emotional Support Chat**: AI-powered conversational interface for mental wellness
- **Voice Responses**: Text-to-speech capabilities with customizable voices
- **User Authentication**: Secure login/signup with Google and email/password options
- **Subscription Plans**: Free, Premium, and Pro tiers with different feature sets
- **Responsive Design**: Beautiful UI that works on all devices
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Robust Security**: Comprehensive input validation on all API endpoints

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS with custom indigo theme
- **Animations**: Framer Motion
- **Authentication**: Firebase Authentication
- **Payments**: Stripe Checkout and Billing
- **Voice**: Self-hosted XTTS (Coqui TTS)
- **Chat AI**: Local TinyLlama model with ONNX Runtime
- **Validation**: Zod schema validation
- **Testing**: Vitest with React Testing Library
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account
- Stripe account
- Docker and Docker Compose for self-hosted TTS
- Hugging Face account (for model downloads)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd therapeutic-ai-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
XTTS_API_URL=http://localhost:8000
XTTS_API_KEY=your_xtts_api_key
```

4. Download the AI model files:
```bash
# On Windows, run the provided PowerShell script
./download-model.ps1

# On other systems, use the Hugging Face CLI
huggingface-cli download TinyLlama/TinyLlama-1.1B-Chat-v1.0 config.json tokenizer.json tokenizer_config.json special_tokens_map.json --local-dir models --local-dir-use-symlinks False
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
therapeutic-ai-assistant/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components
│   ├── payment/        # Payment and subscription components
│   └── voice/          # Voice and TTS components
├── public/              # Static assets
└── ...
```

## Deployment

This project is configured for deployment on Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Testing

Run the test suite with:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.