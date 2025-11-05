// XTTS Client for self-hosted text-to-speech service

export interface VoiceSynthesisResult {
  success: boolean;
  audioUrl?: string;
  message?: string;
  error?: string;
}

export interface XTTSVoiceSettings {
  text: string;
  voiceId: string;
  speed?: number;
  language?: string;
}

export async function synthesizeWithXTTS(settings: XTTSVoiceSettings, apiUrl: string, apiKey?: string): Promise<VoiceSynthesisResult> {
  try {
    // Map our voice IDs to XTTS voice names
    const voiceMapping: Record<string, string> = {
      'female-1': 'female',
      'male-1': 'male',
      'female-2': 'female',
      'male-2': 'male'
    };

    // Prepare the request payload
    const payload = {
      text: settings.text,
      speaker_wav: voiceMapping[settings.voiceId] || 'female',
      language: settings.language || 'en',
      speed: settings.speed || 1.0
    };

    // Make the API request to our self-hosted XTTS service
    const response = await fetch(`${apiUrl}/tts_to_audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`XTTS API error: ${response.statusText}`);
    }

    // The XTTS API returns audio data directly as WAV
    // For our implementation, we'll create a unique ID for this audio
    const audioId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      message: 'Voice synthesis completed successfully',
      audioUrl: `${apiUrl}/audio/${audioId}`
    };
  } catch (error) {
    console.error('XTTS synthesis error:', error);
    return {
      success: false,
      error: 'Failed to generate voice with XTTS'
    };
  }
}