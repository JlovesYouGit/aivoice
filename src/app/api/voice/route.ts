import { NextResponse } from 'next/server'
import { voiceSynthesisSchema } from '@/utils/validation/schemas'
import { validateInput, handleValidationError } from '@/utils/validation/validate'
import { Errors } from '@/src/utils/errorHandler'
import { synthesizeWithXTTS } from '@/lib/tts/xtts-client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input using Zod
    const validation = validateInput(voiceSynthesisSchema, body)
    if (!validation.success) {
      return handleValidationError(validation.errors)
    }
    
    const { text, voiceId, speed } = validation.data

    // Get TTS configuration from environment variables
    const ttsApiUrl = process.env.XTTS_API_URL || 'http://localhost:8000';
    const ttsApiKey = process.env.XTTS_API_KEY;

    // Call our self-hosted XTTS service
    const result = await synthesizeWithXTTS(
      { text, voiceId, speed },
      ttsApiUrl,
      ttsApiKey
    );
    
    if (!result.success) {
      return Errors.badRequest(result.error || 'Failed to generate voice');
    }
    
    return NextResponse.json({
      success: true,
      message: result.message || 'Voice synthesis completed successfully',
      audioUrl: result.audioUrl
    })
    
  } catch (error: any) {
    console.error('Voice API error:', error)
    return Errors.internal(error)
  }
}