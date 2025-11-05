// Component prop types

export interface AuthComponentProps {
  onSignup?: (email: string, password: string) => void;
  onLogin?: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export interface VoiceSettings {
  voiceId: string;
  speed: number;
}

export interface VoiceControlsProps {
  isEnabled: boolean;
  settings: VoiceSettings;
  onToggle: (enabled: boolean) => void;
  onSettingsChange: (settings: VoiceSettings) => void;
}

export interface SubscriptionPlansProps {
  onSelectPlan: (planId: string) => void;
}