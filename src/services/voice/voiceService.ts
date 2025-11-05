import { synthesizeWithXTTS, XTTSVoiceSettings } from '../../lib/tts/xtts-client';

export interface VoiceSettings {
  voiceId: string;
  speed: number;
}

export interface VoiceSynthesisResult {
  success: boolean;
  audioUrl?: string;
  message?: string;
  error?: string;
}

export async function synthesizeVoice(text: string, settings: VoiceSettings, apiUrl: string, apiKey?: string): Promise<VoiceSynthesisResult> {
  try {
    // Validate input
    if (!text || !settings.voiceId) {
      return {
        success: false,
        error: 'Text and voiceId are required'
      };
    }

    // Prepare XTTS settings
    const xttsSettings: XTTSVoiceSettings = {
      text,
      voiceId: settings.voiceId,
      speed: settings.speed
    };

    // Call our self-hosted XTTS service
    return await synthesizeWithXTTS(xttsSettings, apiUrl, apiKey);
  } catch (error) {
    console.error('Voice synthesis error:', error);
    return {
      success: false,
      error: 'Failed to generate voice'
    };
  }
}