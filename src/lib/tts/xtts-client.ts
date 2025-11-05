// XTTS Client for self-hosted text-to-speech service

export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: string;
  description: string;
}

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

/**
 * Fetch available voices from the XTTS API
 */
export async function getAvailableVoices(apiUrl: string, apiKey?: string): Promise<Voice[]> {
  try {
    // Make the API request to get available voices
    const response = await fetch(`${apiUrl}/voices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      }
    });

    if (!response.ok) {
      throw new Error(`XTTS API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the API response to our Voice interface
    if (data.voices && Array.isArray(data.voices)) {
      return data.voices.map((voice: any) => ({
        id: voice.id || voice.name,
        name: voice.name || voice.id,
        gender: voice.gender || 'female',
        language: voice.language || 'en',
        description: voice.description || `A ${voice.gender || 'neutral'} voice for ${voice.language || 'English'}`
      }));
    }
    
    // Fallback to default voices if API doesn't return voice list
    return [
      { id: 'female-1', name: 'Serene Female', gender: 'female', language: 'en', description: 'Warm and nurturing female voice' },
      { id: 'male-1', name: 'Serene Male', gender: 'male', language: 'en', description: 'Calm and reassuring male voice' },
      { id: 'female-2', name: 'Professional Female', gender: 'female', language: 'en', description: 'Clear and professional female voice' },
      { id: 'male-2', name: 'Friendly Male', gender: 'male', language: 'en', description: 'Approachable and friendly male voice' }
    ];
  } catch (error) {
    console.error('Error fetching XTTS voices:', error);
    // Return default voices if API call fails
    return [
      { id: 'female-1', name: 'Serene Female', gender: 'female', language: 'en', description: 'Warm and nurturing female voice' },
      { id: 'male-1', name: 'Serene Male', gender: 'male', language: 'en', description: 'Calm and reassuring male voice' },
      { id: 'female-2', name: 'Professional Female', gender: 'female', language: 'en', description: 'Clear and professional female voice' },
      { id: 'male-2', name: 'Friendly Male', gender: 'male', language: 'en', description: 'Approachable and friendly male voice' }
    ];
  }
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

    // Get the audio data as ArrayBuffer
    const audioData = await response.arrayBuffer();
    
    // Convert PCM data to WAV format
    const wavBlob = await convertPcmToWav(audioData);
    
    // Create object URL for the WAV blob
    const audioUrl = URL.createObjectURL(wavBlob);
    
    return {
      success: true,
      audioUrl: audioUrl,
      message: 'Voice synthesis completed successfully'
    };
  } catch (error) {
    console.error('XTTS synthesis error:', error);
    return {
      success: false,
      error: 'Failed to generate voice with XTTS'
    };
  }
}

/**
 * Convert PCM audio data to WAV format
 */
async function convertPcmToWav(pcmData: ArrayBuffer): Promise<Blob> {
  // Create WAV header
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  
  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // File length
  view.setUint32(4, 36 + pcmData.byteLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // Format chunk identifier
  writeString(view, 12, 'fmt ');
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // Channel count (1 for mono)
  view.setUint16(22, 1, true);
  // Sample rate (22050 Hz)
  view.setUint32(24, 22050, true);
  // Byte rate (sample rate * channels * bits per sample / 8)
  view.setUint32(28, 22050 * 1 * 16 / 8, true);
  // Block align (channels * bits per sample / 8)
  view.setUint16(32, 1 * 16 / 8, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // Data chunk identifier
  writeString(view, 36, 'data');
  // Data chunk length
  view.setUint32(40, pcmData.byteLength, true);
  
  // Combine header and PCM data
  const wavBuffer = new Uint8Array(header.byteLength + pcmData.byteLength);
  wavBuffer.set(new Uint8Array(header), 0);
  wavBuffer.set(new Uint8Array(pcmData), header.byteLength);
  
  // Return as WAV blob
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

/**
 * Write a string to a DataView
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}