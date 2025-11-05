'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../common/Icon'

interface VoiceControlsProps {
  onToggleVoice: (enabled: boolean) => void
  isVoiceEnabled: boolean
  voiceSettings: {
    voiceId: string
    speed: number
  }
  onVoiceSettingsChange: (settings: any) => void
}

export default function VoiceControls({ 
  onToggleVoice, 
  isVoiceEnabled, 
  voiceSettings, 
  onVoiceSettingsChange 
}: VoiceControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const voices = [
    { 
      id: 'female-1', 
      name: 'Serena', 
      description: 'Warm & Nurturing',
      icon: 'userFemale'
    },
    { 
      id: 'male-1', 
      name: 'Marcus', 
      description: 'Calm & Reassuring',
      icon: 'userMale'
    },
    { 
      id: 'female-2', 
      name: 'Aria', 
      description: 'Friendly & Approachable',
      icon: 'userFemale'
    },
    { 
      id: 'male-2', 
      name: 'David', 
      description: 'Professional & Clear',
      icon: 'professional'
    }
  ]

  const handlePlay = async () => {
    setIsPlaying(!isPlaying)
    
    if (!isPlaying) {
      console.log('Playing test voice with settings:', voiceSettings)
      
      // Simulate playing for 3 seconds
      setTimeout(() => {
        setIsPlaying(false)
      }, 3000)
      
      // In production, this would call the voice API:
      // const response = await fetch('/api/voice', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     text: 'Hello, I\'m Serene. I\'m here to support you on your mental wellness journey.',
      //     voiceId: voiceSettings.voiceId,
      //     speed: voiceSettings.speed
      //   })
      // });
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }

  const selectedVoice = voices.find(v => v.id === voiceSettings.voiceId) || voices[0]

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <audio ref={audioRef} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Voice Settings</h2>
            <p className="text-xs text-gray-500">Customize your audio experience</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Voice toggle */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Voice Responses</h3>
              <p className="text-sm text-gray-600">Hear Serene speak with emotion and empathy</p>
            </div>
            <button
              onClick={() => onToggleVoice(!isVoiceEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isVoiceEnabled ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-300'
              }`}
            >
              <motion.span
                layout
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                  isVoiceEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isVoiceEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Voice selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Choose Voice
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {voices.map((voice) => (
                    <motion.button
                      key={voice.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onVoiceSettingsChange({ ...voiceSettings, voiceId: voice.id })}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        voiceSettings.voiceId === voice.id
                          ? 'border-indigo-600 bg-indigo-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                          <Icon type={voice.icon} className="w-4 h-4 text-white" animate={false} />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{voice.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">{voice.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Speed control */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    Speech Speed
                  </label>
                  <span className="text-sm font-medium text-indigo-600">
                    {voiceSettings.speed}x
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.speed}
                    onChange={(e) => onVoiceSettingsChange({ ...voiceSettings, speed: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    style={{
                      background: `linear-gradient(to right, rgb(79, 70, 229) 0%, rgb(79, 70, 229) ${((voiceSettings.speed - 0.5) / 1.5) * 100}%, rgb(229, 231, 235) ${((voiceSettings.speed - 0.5) / 1.5) * 100}%, rgb(229, 231, 235) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                    <span>Slower</span>
                    <span>Normal</span>
                    <span>Faster</span>
                  </div>
                </div>
              </div>

              {/* Advanced settings toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900 transition"
              >
                <span className="font-medium">Advanced Settings</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Advanced settings */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-2 border-t border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Auto-play responses</span>
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Voice feedback</span>
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Background sounds</span>
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Test voice button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlay}
                disabled={!isVoiceEnabled}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? (
                  <>
                    <svg 
                      className="w-5 h-5 animate-pulse" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Playing...
                  </>
                ) : (
                  <>
                    <svg 
                      className="w-5 h-5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Test Voice
                  </>
                )}
              </motion.button>

              {/* Voice preview info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{selectedVoice.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Current: {selectedVoice.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {selectedVoice.description} • {voiceSettings.speed}x speed
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disabled state message */}
        {!isVoiceEnabled && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Enable voice responses to customize settings
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
