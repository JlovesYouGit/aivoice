'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getVoices } from '../../services/voice/voiceService';
import { SubscriptionPlan, canUseVoice } from '../../utils/subscription';

interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: string;
  description: string;
}

interface VoiceSettings {
  voiceId: string
  speed: number
}

interface VoiceControlsProps {
  onToggleVoice: (enabled: boolean) => void
  isVoiceEnabled: boolean
  voiceSettings: VoiceSettings
  onVoiceSettingsChange: (settings: VoiceSettings) => void
  userSubscriptionPlan?: SubscriptionPlan // Add subscription plan prop
}

export default function VoiceControls({ onToggleVoice, isVoiceEnabled, voiceSettings, onVoiceSettingsChange, userSubscriptionPlan = 'free' }: VoiceControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [voices, setVoices] = useState<Voice[]>([])
  const [loadingVoices, setLoadingVoices] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch available voices on component mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_XTTS_API_URL || 'http://localhost:8000';
        const voices = await getVoices(apiUrl);
        setVoices(voices);
        setLoadingVoices(false);
      } catch (error) {
        console.error('Error fetching voices:', error);
        // Fallback to default voices
        setVoices([
          { id: 'female-1', name: 'Serene Female', gender: 'female', language: 'en', description: 'Warm and nurturing female voice' },
          { id: 'male-1', name: 'Serene Male', gender: 'male', language: 'en', description: 'Calm and reassuring male voice' },
          { id: 'female-2', name: 'Professional Female', gender: 'female', language: 'en', description: 'Clear and professional female voice' },
          { id: 'male-2', name: 'Friendly Male', gender: 'male', language: 'en', description: 'Approachable and friendly male voice' }
        ]);
        setLoadingVoices(false);
      }
    };

    fetchVoices();
  }, []);

  const handlePlay = async () => {
    // Toggle playing state
    setIsPlaying(!isPlaying);
    
    // In a real implementation, this would trigger text-to-speech
    if (!isPlaying) {
      // Play test voice
      try {
        const response = await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: 'This is a test of the voice synthesis system.',
            voiceId: voiceSettings.voiceId,
            speed: voiceSettings.speed
          })
        });
        
        const data = await response.json();
        if (data.success && data.audioUrl) {
          if (audioRef.current) {
            audioRef.current.src = data.audioUrl;
            audioRef.current.play();
          }
        }
      } catch (error) {
        console.error('Error playing test voice:', error);
      }
    } else {
      // Stop audio playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleVoiceToggle = () => {
    // Only allow voice toggle if user has access to voice features
    if (!isVoiceEnabled && !canUseVoice(userSubscriptionPlan)) {
      alert('Voice features are only available in Premium and Pro plans. Please upgrade your subscription.');
      return;
    }
    onToggleVoice(!isVoiceEnabled)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Hidden audio element for playing synthesized speech */}
      <audio ref={audioRef} />
      
      <h2 className="text-xl font-bold text-indigo-900 mb-4">Voice Settings</h2>
      
      <div className="space-y-6">
        {/* Voice toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Voice Responses</h3>
            <p className="text-sm text-gray-500">Enable spoken responses from Serene</p>
          </div>
          <button
            onClick={handleVoiceToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isVoiceEnabled ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isVoiceEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Voice selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
          {loadingVoices ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              Loading voices...
            </div>
          ) : (
            <select
              value={voiceSettings.voiceId}
              onChange={(e) => {
                // Only allow voice settings change if user has access to voice features
                if (!canUseVoice(userSubscriptionPlan)) {
                  alert('Voice features are only available in Premium and Pro plans. Please upgrade your subscription.');
                  return;
                }
                onVoiceSettingsChange({ ...voiceSettings, voiceId: e.target.value })
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!canUseVoice(userSubscriptionPlan)}
            >
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} - {voice.description}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Speed control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Speed: {voiceSettings.speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={voiceSettings.speed}
            onChange={(e) => {
              // Only allow voice settings change if user has access to voice features
              if (!canUseVoice(userSubscriptionPlan)) {
                alert('Voice features are only available in Premium and Pro plans. Please upgrade your subscription.');
                return;
              }
              onVoiceSettingsChange({ ...voiceSettings, speed: parseFloat(e.target.value) })
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            disabled={!canUseVoice(userSubscriptionPlan)}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>

        {/* Test voice button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePlay}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition"
          disabled={!isVoiceEnabled || !canUseVoice(userSubscriptionPlan)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.895-4.21-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.415 1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {isPlaying ? 'Playing...' : 'Test Voice'}
        </motion.button>
      </div>
    </div>
  )
}