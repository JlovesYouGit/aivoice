'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginComponent from '../components/auth/LoginComponent'
import SignupComponent from '../components/auth/SignupComponent'
import ChatInterface from '../components/chat/ChatInterface'
import VoiceControls from '../components/voice/VoiceControls'
import SubscriptionPlans from '../components/payment/SubscriptionPlans'

export default function Home() {
  const [authState, setAuthState] = useState('login') // 'login', 'signup', 'authenticated'
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m Serene, your compassionate AI assistant for mental wellness. How are you feeling today?'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState({
    voiceId: 'female-1',
    speed: 1.0
  })

  // Mock authentication functions
  const handleLogin = (email: string, password: string) => {
    console.log('Login attempt with:', email, password)
    // In a real app, this would call your authentication API
    setAuthState('authenticated')
  }

  const handleGoogleLogin = () => {
    console.log('Google login')
    // In a real app, this would initiate Google OAuth
    setAuthState('authenticated')
  }

  const handleSignup = (email: string, password: string) => {
    console.log('Signup attempt with:', email, password)
    // In a real app, this would call your signup API
    setAuthState('authenticated')
  }

  const handleLogout = () => {
    setAuthState('login')
  }

  // Mock chat functions
  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "I understand how you're feeling. It takes courage to share these thoughts.",
        "Thank you for opening up to me. Your feelings are valid and important.",
        "It sounds like you're going through a challenging time. Let's explore this together.",
        "I'm here to listen without judgment. What else would you like to share?",
        "Your perspective is valuable. How long have you been feeling this way?",
        "It's okay to feel this way. Many people experience similar emotions.",
        "What do you think might help you feel better in this situation?",
        "I appreciate your honesty. Let's work through this step by step."
      ]
      
      const aiMessage = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  // Voice functions
  const handleToggleVoice = (enabled: boolean) => {
    setIsVoiceEnabled(enabled)
  }

  const handleVoiceSettingsChange = (settings: any) => {
    setVoiceSettings(settings)
  }

  // Payment functions
  const handleSelectPlan = (planId: string) => {
    console.log('Selected plan:', planId)
    // In a real app, this would redirect to the payment page
    alert(`You selected the ${planId} plan. In a real app, this would proceed to payment.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <AnimatePresence mode="wait">
        {authState === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <LoginComponent 
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onSignUp={() => setAuthState('signup')}
            />
          </motion.div>
        )}

        {authState === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <SignupComponent 
              onSignup={handleSignup}
              onLogin={() => setAuthState('login')}
            />
          </motion.div>
        )}

        {authState === 'authenticated' && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            {/* Header */}
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <h1 className="text-xl font-bold text-indigo-900">Serene</h1>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>

            {/* Main content */}
            <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-6">
              {/* Chat interface - larger on mobile, smaller on desktop */}
              <div className="flex-1 h-[70vh] md:h-[80vh] rounded-2xl overflow-hidden shadow-xl">
                <ChatInterface 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>

              {/* Sidebar with voice controls and subscription plans */}
              <div className="w-full md:w-80 space-y-6">
                <VoiceControls 
                  isVoiceEnabled={isVoiceEnabled}
                  onToggleVoice={handleToggleVoice}
                  voiceSettings={voiceSettings}
                  onVoiceSettingsChange={handleVoiceSettingsChange}
                />
                
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-indigo-900 mb-4">Subscription</h2>
                  <SubscriptionPlans onSelectPlan={handleSelectPlan} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}