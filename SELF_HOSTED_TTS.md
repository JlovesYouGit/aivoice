# Self-Hosted Text-to-Speech Setup

This document explains how to set up and use the self-hosted text-to-speech (TTS) system for the Serene therapeutic AI assistant.

## Overview

We've replaced the dependency on ElevenLabs with a self-hosted TTS solution using Coqui's XTTS-v2 model. This provides:

1. **Full Control**: No reliance on third-party services
2. **Privacy**: All voice data stays within your infrastructure
3. **Cost Savings**: No per-character fees
4. **Customization**: Ability to fine-tune voices

## Prerequisites

- Docker and Docker Compose
- NVIDIA GPU (recommended) or CPU-only setup
- At least 8GB RAM
- 10GB free disk space

## Setup Instructions

### 1. Install Docker

If you haven't already, install Docker Desktop or Docker Engine:

- [Docker Desktop for Windows/Mac](https://www.docker.com/products/docker-desktop/)
- [Docker Engine for Linux](https://docs.docker.com/engine/install/)

### 2. Agree to Coqui Terms of Service

Before running the XTTS service, you must agree to Coqui's Terms of Service by setting an environment variable:

```bash
export COQUI_TOS_AGREED=1
```

On Windows, use:
```cmd
set COQUI_TOS_AGREED=1
```

### 3. Start the TTS Service

From the project root directory, run:

```bash
docker-compose -f docker-compose.tts.yml up -d
```

This will start two services:
- `xtts-server`: GPU-accelerated TTS service on port 8000
- `xtts-server-cpu`: CPU-only TTS service on port 8001 (fallback)

### 4. Configure Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
XTTS_API_URL=http://localhost:8000
XTTS_API_KEY=your-api-key-if-needed
```

## Voice Options

The self-hosted TTS supports the following voice IDs that match the original ElevenLabs voices:

| Voice ID | Gender | Description |
|----------|--------|-------------|
| female-1 | Female | Warm and nurturing |
| male-1 | Male | Calm and reassuring |
| female-2 | Female | Friendly and approachable |
| male-2 | Male | Professional and clear |

## API Usage

The TTS service exposes a simple REST API:

### Text-to-Speech Endpoint

```bash
POST /tts
Content-Type: application/json

{
  "text": "Hello, this is a test message",
  "speaker_wav": "female",
  "language": "en",
  "speed": 1.0
}
```

### Response

```json
{
  "success": true,
  "audio_url": "http://localhost:8000/audio/12345"
}
```

## Fine-Tuning Voices

To create custom voices that better match the original ElevenLabs voices:

1. Record 6-second audio samples of the desired voices
2. Place the audio files in the `tts-models` directory
3. Update the voice mapping in `src/lib/tts/xtts-client.ts`

## Performance Considerations

- GPU acceleration significantly improves synthesis speed
- CPU-only synthesis is 5-10x slower but works on any machine
- For production use, consider running multiple instances behind a load balancer

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

## Security

- The TTS service should not be exposed to the public internet
- Use API keys for authentication in production
- Regularly update the Docker images for security patches

## Future Enhancements

1. **Voice Cloning**: Use the provided audio samples to fine-tune voices
2. **Multilingual Support**: Enable support for additional languages
3. **Streaming**: Implement real-time audio streaming
4. **Caching**: Add audio caching for repeated phrases

This self-hosted solution provides all the functionality of the original ElevenLabs integration while giving you complete control over your voice data and eliminating ongoing service costs.