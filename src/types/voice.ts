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