# Self-Hosted Text-to-Speech Implementation

## Overview

This document provides a comprehensive guide to the self-hosted Text-to-Speech (TTS) implementation in the Serene therapeutic AI assistant. We've successfully replaced the dependency on ElevenLabs with a self-hosted solution using Coqui's XTTS-v2 model, providing full control over voice data while maintaining high-quality voice synthesis.

## Architecture

The TTS implementation follows a layered architecture:

```
Frontend Components → Voice Service → XTTS Client → Self-Hosted XTTS Server
```

### Components

1. **VoiceControls Component** (`src/components/voice/VoiceControls.tsx`)
   - UI for voice settings (voice selection, speed control)
   - Toggle for enabling/disabling voice responses
   - Test voice functionality

2. **Voice Service** (`src/services/voice/voiceService.ts`)
   - Business logic for voice synthesis
   - Interface between frontend and XTTS client

3. **XTTS Client** (`src/lib/tts/xtts-client.ts`)
   - Low-level API client for the self-hosted XTTS service
   - Handles HTTP requests to the XTTS server
   - Maps internal voice IDs to XTTS voice names

4. **Voice API Route** (`src/app/api/voice/route.ts`)
   - Backend endpoint for voice synthesis requests
   - Input validation using Zod schemas
   - Integration with XTTS client

## Voice Mapping

The self-hosted TTS supports the following voice IDs that match the original ElevenLabs voices:

| Voice ID | Gender | Description | XTTS Mapping |
|----------|--------|-------------|--------------|
| female-1 | Female | Warm and nurturing | female |
| male-1 | Male | Calm and reassuring | male |
| female-2 | Female | Friendly and approachable | female |
| male-2 | Male | Professional and clear | male |

## API Integration

### Voice Synthesis Endpoint

The application uses the following endpoint for voice synthesis:

```
POST /api/voice
Content-Type: application/json

{
  "text": "Hello, this is a test message",
  "voiceId": "female-1",
  "speed": 1.0
}
```

### Response Format

```json
{
  "success": true,
  "message": "Voice synthesis completed successfully",
  "audioUrl": "http://localhost:8000/audio/audio_1234567890_abc123def"
}
```

## Self-Hosted XTTS Server

### Docker Configuration

The XTTS server is configured using Docker Compose with two options:

1. **GPU-Accelerated Version** (recommended)
   - Uses NVIDIA GPU for faster processing
   - Runs on port 8000

2. **CPU-Only Version** (fallback)
   - Works on any machine but slower
   - Runs on port 8001

### Starting the Service

```bash
# Start the TTS service
docker-compose -f docker-compose.tts.yml up -d

# Check service status
docker-compose -f docker-compose.tts.yml logs -f
```

### Environment Variables

```env
XTTS_API_URL=http://localhost:8000
XTTS_API_KEY=your-api-key-if-needed
```

## Implementation Details

### XTTS Client

The XTTS client handles communication with the self-hosted server:

```typescript
// Prepare the request payload
const payload = {
  text: settings.text,
  speaker_wav: voiceMapping[settings.voiceId] || 'female',
  language: settings.language || 'en',
  speed: settings.speed || 1.0
};

// Make the API request
const response = await fetch(`${apiUrl}/tts_to_audio`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
  },
  body: JSON.stringify(payload)
});
```

### Voice Service Integration

The voice service integrates the XTTS client with the application:

```typescript
// Call our self-hosted XTTS service
const result = await synthesizeWithXTTS(
  { text, voiceId, speed },
  ttsApiUrl,
  ttsApiKey
);

if (!result.success) {
  return Errors.badRequest(result.error || 'Failed to generate voice');
}
```

### API Route Implementation

The API route handles voice synthesis requests:

```typescript
// Validate input using Zod
const validation = validateInput(voiceSynthesisSchema, body)
if (!validation.success) {
  return handleValidationError(validation.errors)
}

// Call our self-hosted XTTS service
const result = await synthesizeWithXTTS(
  { text, voiceId, speed },
  ttsApiUrl,
  ttsApiKey
);

if (!result.success) {
  return Errors.badRequest(result.error || 'Failed to generate voice');
}
```

## Security Considerations

1. **Input Validation**: All API endpoints use Zod schemas for input validation
2. **Environment Isolation**: TTS service runs in isolated Docker containers
3. **API Key Protection**: Optional API key authentication for the TTS service
4. **No External Dependencies**: Complete elimination of third-party API calls

## Performance Optimization

1. **GPU Acceleration**: Leverages NVIDIA GPUs for faster voice synthesis
2. **Caching Strategy**: Audio files can be cached for repeated phrases
3. **Resource Management**: Separate CPU and GPU versions for different environments

## Future Enhancements

1. **Voice Cloning**: Fine-tune voices using provided audio samples
2. **Multilingual Support**: Enable support for additional languages
3. **Streaming**: Implement real-time audio streaming
4. **Caching**: Add audio caching for repeated phrases
5. **Custom Voices**: Create domain-specific voices for therapeutic contexts

## Troubleshooting

### Common Issues

1. **GPU not detected**: Ensure NVIDIA Docker runtime is installed
2. **Insufficient memory**: Close other applications or use CPU version
3. **Voice quality issues**: Try fine-tuning with longer audio samples

### Logs

Check service logs with:

```bash
docker-compose -f docker-compose.tts.yml logs -f
```

## Benefits of Self-Hosted Solution

1. **Full Control**: No reliance on third-party services
2. **Privacy**: All voice data stays within your infrastructure
3. **Cost Savings**: No per-character fees
4. **Customization**: Ability to fine-tune voices
5. **Reliability**: No external service outages
6. **Compliance**: Better data protection compliance

This self-hosted solution provides all the functionality of the original ElevenLabs integration while giving you complete control over your voice data and eliminating ongoing service costs.