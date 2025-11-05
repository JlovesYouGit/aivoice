'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LandingPage from '../components/landing/LandingPage'
import LoginComponent from '../components/auth/LoginComponent'
import SignupComponent from '../components/auth/SignupComponent'
import ChatInterface from '../components/chat/ChatInterface'
import VoiceControls from '../components/voice/VoiceControls'
import SubscriptionPlans from '../components/payment/SubscriptionPlans'

export default function Home() {
  const [authState, setAuthState] = useState('landing') // 'landing', 'login', 'signup', 'authenticated'
  const [user, setUser] = useState<any>(null)
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
  const [error, setError] = useState<string | null>(null)
  const [showSubscription, setShowSubscription] = useState(false)

  // Authentication functions
  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null)
      console.log('Login attempt with:', email)
      
      // Mock validation
      if (!email || !password) {
        setError('Please provide both email and password')
        return
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please provide a valid email address')
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUser({ email, name: email.split('@')[0] })
      setAuthState('authenticated')
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      console.log('Google login initiated')
      
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful Google login
      setUser({ 
        email: 'user@gmail.com', 
        name: 'Google User',
        provider: 'google' 
      })
      setAuthState('authenticated')
    } catch (err) {
      setError('Google login failed. Please try again.')
    }
  }

  const handleSignup = async (email: string, password: string, name?: string) => {
    try {
      setError(null)
      console.log('Signup attempt with:', email)
      
      // Mock validation
      if (!email || !password) {
        setError('Please provide both email and password')
        return
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please provide a valid email address')
        return
      }
      
      if (password.length < 8) {
        setError('Password must be at least 8 characters long')
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUser({ email, name: name || email.split('@')[0] })
      setAuthState('authenticated')
    } catch (err) {
      setError('Signup failed. Please try again.')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setAuthState('landing')
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m Serene, your compassionate AI assistant for mental wellness. How are you feeling today?'
      }
    ])
  }

  // Chat functions
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return
    
    // Add user message
    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // Simulate AI response with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
      
      const responses = [
        "I understand how you're feeling. It takes courage to share these thoughts, and I want you to know that your feelings are completely valid.",
        "Thank you for opening up to me. Your perspective is important, and I'm here to support you through this.",
        "It sounds like you're going through a challenging time. Let's explore this together at a pace that feels comfortable for you.",
        "I'm here to listen without judgment. What you're experiencing matters, and I'd like to understand more about what's on your mind.",
        "Your honesty is appreciated. Many people experience similar emotions, and it's a sign of strength to acknowledge them.",
        "That must be difficult to deal with. How long have you been feeling this way? Understanding the timeline can help us work through it.",
        "What do you think might help you feel better in this situation? Sometimes our own insights can be the most powerful.",
        "I hear you, and I want you to know that these feelings are temporary, even when they feel overwhelming. Let's work through this step by step."
      ]
      
      const aiMessage = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      // Optionally play voice response
      if (isVoiceEnabled) {
        console.log('Playing voice response with settings:', voiceSettings)
        // Voice playback would happen here in real implementation
      }
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
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
    alert(`You selected the ${planId.toUpperCase()} plan. In a production app, this would redirect to Stripe checkout.`)
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {authState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage
              onGetStarted={() => setAuthState('signup')}
              onLogin={() => setAuthState('login')}
            />
          </motion.div>
        )}

        {authState === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4"
          >
            <LoginComponent 
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onSignUp={() => setAuthState('signup')}
              onBack={() => setAuthState('landing')}
              error={error}
            />
          </motion.div>
        )}

        {authState === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4"
          >
            <SignupComponent 
              onSignup={handleSignup}
              onLogin={() => setAuthState('login')}
              onBack={() => setAuthState('landing')}
              error={error}
            />
          </motion.div>
        )}

        {authState === 'authenticated' && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100"
          >
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-xl">🧘</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Serene
                      </h1>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 hidden sm:block">
                      Welcome, <span className="font-semibold">{user?.name}</span>
                    </span>
                    <button
                      onClick={() => setShowSubscription(!showSubscription)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                    >
                      {showSubscription ? 'Chat' : 'Plans'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            {!showSubscription ? (
              <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 gap-6">
                {/* Chat interface */}
                <div className="flex-1 h-[calc(100vh-140px)] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                  <ChatInterface 
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    userName={user?.name}
                  />
                </div>

                {/* Sidebar with voice controls */}
                <div className="w-full lg:w-80 space-y-6">
                  <VoiceControls 
                    isVoiceEnabled={isVoiceEnabled}
                    onToggleVoice={handleToggleVoice}
                    voiceSettings={voiceSettings}
                    onVoiceSettingsChange={handleVoiceSettingsChange}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto py-8">
                <SubscriptionPlans onSelectPlan={handleSelectPlan} />
              </div>
            )}

            {/* Error notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-xl max-w-md"
                >
                  <div className="flex items-center justify-between">
                    <span>{error}</span>
                    <button 
                      onClick={() => setError(null)}
                      className="ml-4 text-white hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
