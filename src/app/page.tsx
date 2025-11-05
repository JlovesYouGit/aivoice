'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import LandingPage from '../components/landing/LandingPage'
import LoginComponent from '../components/auth/LoginComponent'
import SignupComponent from '../components/auth/SignupComponent'
import ChatInterface from '../components/chat/ChatInterface'
import VoiceControls from '../components/voice/VoiceControls'
import UserInsights from '../components/analytics/UserInsights'
import { SubscriptionPlan } from '@/utils/subscription'
import { canUseVoice } from '@/utils/subscription'
import { getConversationHistory, initializeConversationHistory, addMessageToHistory, Message as HistoryMessage } from '@/utils/conversationHistory'
import { needsRealTimeInfo, googleSearch } from '@/utils/googleSearch'
import { trackMessage, trackSession, getUserAnalytics } from '@/utils/analytics'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export default function Home() {
  const router = useRouter();
  const [authState, setAuthState] = useState('landing') // 'landing', 'login', 'signup', 'authenticated'
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<{ voiceId: string; speed: number }>({
    voiceId: 'female-1',
    speed: 1.0
  })
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [conversationHistory, setConversationHistory] = useState(initializeConversationHistory())
  const [showInsights, setShowInsights] = useState(false)

  // Load conversation history on component mount
  useEffect(() => {
    const history = getConversationHistory();
    if (history) {
      setConversationHistory(history);
      setMessages(history.messages);
    } else {
      // Initialize with welcome message
      const welcomeMessage: Message = {
        role: 'assistant',
        content: 'Hello! I\'m Serene, your compassionate AI assistant for mental wellness. How are you feeling today?',
        timestamp: Date.now()
      };
      const newHistory = addMessageToHistory(initializeConversationHistory(), welcomeMessage);
      setConversationHistory(newHistory);
      setMessages(newHistory.messages);
    }
    
    // Track session start
    const analytics = getUserAnalytics();
    // In a real implementation, we would track the session here
  }, []);

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

  // Current user's subscription plan (mock data - in a real app this would come from the backend)
  const userSubscriptionPlan: SubscriptionPlan = 'premium'; // Default to premium for demo

  // Mock chat functions
  const handleSendMessage = async (message: string, context?: HistoryMessage[]) => {
    // Add user message to both state and history
    const userMessage: Message = { 
      role: 'user', 
      content: message,
      timestamp: Date.now()
    };
    
    const updatedHistory = addMessageToHistory(conversationHistory, userMessage);
    setConversationHistory(updatedHistory);
    setMessages(updatedHistory.messages);
    setIsLoading(true);

    // Check if we need real-time information
    let searchResults = null;
    if (needsRealTimeInfo(message)) {
      const searchResponse = await googleSearch(message);
      if (searchResponse.success && searchResponse.results) {
        searchResults = searchResponse.results;
      }
    }

    // Simulate AI response after a delay
    setTimeout(async () => {
      // Create more contextually aware responses
      let responses = [
        "I understand how you're feeling. It takes courage to share these thoughts.",
        "Thank you for opening up to me. Your feelings are valid and important.",
        "It sounds like you're going through a challenging time. Let's explore this together.",
        "I'm here to listen without judgment. What else would you like to share?",
        "Your perspective is valuable. How long have you been feeling this way?",
        "It's okay to feel this way. Many people experience similar emotions.",
        "What do you think might help you feel better in this situation?",
        "I appreciate your honesty. Let's work through this step by step."
      ];
      
      // If we have search results, incorporate them
      if (searchResults && searchResults.length > 0) {
        responses = [
          `I found some current information that might be helpful: ${searchResults[0].snippet.substring(0, 100)}...`,
          `Based on recent information, ${searchResults[0].snippet}`,
          `Here's what I found about that: ${searchResults[0].snippet.substring(0, 80)}...`,
          ...responses
        ];
      }
      
      // If we have context, make responses more relevant
      if (context && context.length > 1) {
        // Analyze the last few messages to provide more relevant responses
        const lastUserMessage = context.filter(msg => msg.role === 'user').pop();
        const lastAssistantMessage = context.filter(msg => msg.role === 'assistant').pop();
        
        if (lastUserMessage) {
          // Add more contextually relevant responses
          responses = [
            `Building on what you mentioned about "${lastUserMessage.content.substring(0, 30)}...", how has that been affecting you?`,
            `I remember you mentioned something important. Let's dive deeper into that.`,
            `Following up on our previous conversation, what aspects of this situation feel most challenging to you right now?`,
            `I'd like to understand more about what you shared earlier. What emotions come up when you think about that?`,
            ...responses
          ];
        }
      }
      
      const aiMessage: Message = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now()
      }
      
      const finalHistory = addMessageToHistory(updatedHistory, aiMessage);
      setConversationHistory(finalHistory);
      setMessages(finalHistory.messages);
      setIsLoading(false)
      
      // If voice is enabled and user has access to voice features, synthesize and play the response
      if (isVoiceEnabled && canUseVoice(userSubscriptionPlan)) {
        try {
          const response = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: aiMessage.content,
              voiceId: voiceSettings.voiceId,
              speed: voiceSettings.speed
            })
          });
          
          const data = await response.json();
          if (data.success && data.audioUrl) {
            const audio = new Audio(data.audioUrl);
            audio.play();
          }
        } catch (error) {
          console.error('Error playing voice response:', error);
        }
      }
    }, 1500)
  }

  // Voice functions
  const handleToggleVoice = (enabled: boolean) => {
    // Only allow voice toggle if user has access to voice features
    if (enabled && !canUseVoice(userSubscriptionPlan)) {
      alert('Voice features are only available in Premium and Pro plans. Please upgrade your subscription.');
      return;
    }
    setIsVoiceEnabled(enabled)
  }

  const handleVoiceSettingsChange = (settings: { voiceId: string; speed: number }) => {
    // Only allow voice settings change if user has access to voice features
    if (isVoiceEnabled && !canUseVoice(userSubscriptionPlan)) {
      alert('Voice features are only available in Premium and Pro plans. Please upgrade your subscription.');
      return;
    }
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
        {authState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                  <div className="relative">
                    <button 
                      className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                        U
                      </div>
                    </button>
                    
                    {/* Dropdown menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowInsights(true);
                            setIsUserMenuOpen(false);
                          }}
                        >
                          Insights
                        </a>
                        <a href="/subscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Subscription</a>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
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
                  userSubscriptionPlan={userSubscriptionPlan}
                />
                
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-indigo-900 mb-4">Specialized Therapy</h2>
                  <div className="space-y-3">
                    <a 
                      href="/therapy/anxiety" 
                      className="block w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                    >
                      <div className="font-medium text-indigo-900">Anxiety Management</div>
                      <div className="text-sm text-indigo-600">Breathing exercises & CBT techniques</div>
                    </a>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-500">Depression Support</div>
                      <div className="text-sm text-gray-400">Coming soon with Pro plan</div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-500">Sleep Improvement</div>
                      <div className="text-sm text-gray-400">Coming soon with Pro plan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <UserInsights isOpen={showInsights} onClose={() => setShowInsights(false)} />
    </div>
  )
}