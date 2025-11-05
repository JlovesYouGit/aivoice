'use client'

import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Icon from '../common/Icon'

interface LandingPageProps {
  onGetStarted: () => void
  onLogin: () => void
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const [demoStep, setDemoStep] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Demo animation messages
  const demoMessages = [
    { type: 'ai', text: "Hello! I'm Serene. How are you feeling today?" },
    { type: 'user', text: "I've been feeling a bit overwhelmed lately..." },
    { type: 'ai', text: "I understand. It takes courage to share that. Let's talk about what's been weighing on your mind." },
    { type: 'user', text: "Work has been really stressful and I can't seem to relax." },
    { type: 'ai', text: "That sounds challenging. Have you tried any relaxation techniques? I can guide you through some breathing exercises if you'd like." }
  ]

  // Auto-play demo
  useEffect(() => {
    if (showDemo && demoStep < demoMessages.length) {
      const timer = setTimeout(() => {
        setDemoStep(demoStep + 1)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showDemo, demoStep, demoMessages.length])

  const features = [
    {
      icon: 'brain',
      title: 'AI-Powered Support',
      description: 'Advanced conversational AI trained to provide empathetic, personalized mental wellness support 24/7.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: 'target',
      title: 'Personalized Experience',
      description: 'Tailored conversations that adapt to your emotional state and therapeutic needs.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'lock',
      title: 'Complete Privacy',
      description: 'Your conversations are encrypted and private. We never share your data.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: 'microphone',
      title: 'Voice Enabled',
      description: 'Natural voice conversations for a more immersive and comforting experience.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: 'chart',
      title: 'Mood Tracking',
      description: 'Track your emotional journey with insights and analytics over time.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: 'star',
      title: 'Evidence-Based',
      description: 'Built on proven therapeutic techniques and mental health best practices.',
      color: 'from-yellow-500 to-orange-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Premium User',
      content: 'Serene has been a game-changer for my mental health. Having 24/7 support when I need it most is invaluable.',
      rating: 5,
      avatar: 'professional'
    },
    {
      name: 'James K.',
      role: 'Pro User',
      content: 'The voice feature makes conversations feel so natural. It\'s like having a therapist in my pocket.',
      rating: 5,
      avatar: 'userMale'
    },
    {
      name: 'Emily R.',
      role: 'Free User',
      content: 'Even the free tier provides amazing support. I love how understanding and patient Serene is.',
      rating: 5,
      avatar: 'userFemale'
    }
  ]

  const faqs = [
    {
      question: 'How does Serene AI work?',
      answer: 'Serene uses advanced natural language processing and therapeutic frameworks to provide empathetic, personalized mental wellness support. Our AI is trained on evidence-based therapeutic techniques and responds with care and understanding to your unique situation.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Absolutely. All conversations are end-to-end encrypted. We never share, sell, or use your personal data for any purpose other than providing you with support. Your privacy is our top priority, and we are HIPAA compliant.'
    },
    {
      question: 'Can Serene replace my therapist?',
      answer: 'Serene is designed to complement, not replace, professional therapy. While we provide valuable support and coping strategies, we always recommend working with licensed mental health professionals for comprehensive care, especially for serious mental health conditions.'
    },
    {
      question: 'What makes Serene different from other AI chatbots?',
      answer: 'Serene is specifically trained for mental wellness with therapeutic frameworks, offers voice conversations, tracks your emotional journey, and provides personalized insights. Our focus is solely on your mental health, not general conversation.'
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer a free forever plan with basic features. Premium plans start at $9.99/month with unlimited conversations, voice features, and advanced analytics. We also offer a 30-day money-back guarantee on all paid plans.'
    },
    {
      question: 'Can I use Serene on my phone?',
      answer: 'Yes! Serene works perfectly on all devices - phones, tablets, and computers. Our responsive design ensures a great experience no matter how you access the platform.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg shadow-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Icon type="meditation" className="w-6 h-6 text-white" animate={false} />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Serene
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-indigo-600 font-medium transition">FAQ</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 font-medium transition">About</a>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                Sign In
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition"
              >
                Get Started
              </motion.button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold flex items-center gap-2"
              >
                <Icon type="sparkle" className="w-4 h-4" animate={false} />
                Trusted by 10,000+ users worldwide
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Your
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}compassionate{' '}
                </span>
                AI companion
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience empathetic support, anytime you need it. Serene provides personalized mental wellness conversations powered by advanced AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg rounded-full font-semibold shadow-2xl hover:shadow-3xl transition inline-flex items-center justify-center"
                >
                  Start Your Journey
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowDemo(!showDemo)
                    setDemoStep(0)
                  }}
                  className="px-8 py-4 bg-white text-gray-900 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition inline-flex items-center justify-center border-2 border-gray-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Demo
                </motion.button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xl mr-1">★★★★★</span>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">10,000+ Users</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">HIPAA Compliant</span>
                </div>
              </div>
            </motion.div>

            {/* Demo Chat Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Demo Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                      <Icon type="meditation" className="w-5 h-5 text-white" animate={false} />
                    </div>
                    <div>
                      <div className="font-semibold">Serene AI</div>
                      <div className="text-xs text-indigo-100 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        Online
                      </div>
                    </div>
                  </div>
                  {showDemo && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full"
                    >
                      Live Demo
                    </motion.div>
                  )}
                </div>

                {/* Demo Messages */}
                <div className="p-6 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto bg-gradient-to-br from-gray-50 to-indigo-50/30">
                  <AnimatePresence>
                    {demoMessages.slice(0, demoStep).map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                        }`}>
                          {message.text}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {!showDemo && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="mb-4 flex justify-center"
                        >
                          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                            <Icon type="meditation" className="w-12 h-12 text-white" animate={false} />
                          </div>
                        </motion.div>
                        <p className="text-lg font-medium">Click "Watch Demo" to see Serene in action</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Demo Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1 text-gray-500 text-sm">Share your thoughts...</div>
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need for{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                mental wellness
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Serene combines cutting-edge AI with evidence-based therapeutic techniques to provide comprehensive mental health support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100 overflow-hidden group"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <motion.div 
                    animate={{ 
                      scale: hoveredFeature === index ? 1.2 : 1,
                      rotate: hoveredFeature === index ? 5 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mb-4"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon type={feature.icon} className="w-8 h-8 text-white" animate={false} />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>

                {/* Corner decoration */}
                <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by thousands
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from people who found support with Serene
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      viewport={{ once: true }}
                      className="text-yellow-400 text-xl"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <Icon type={testimonial.avatar} className="w-6 h-6 text-white" animate={false} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Serene
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-900 text-lg pr-8">{faq.question}</span>
                  <motion.svg 
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-6 h-6 text-indigo-600 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Help Center Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Serene
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to make mental wellness support accessible to everyone, everywhere, anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Icon type="target" className="w-8 h-8 text-white" animate={false} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide compassionate, AI-powered mental wellness support that's accessible 24/7, breaking down barriers to mental health care and empowering individuals on their journey to emotional well-being.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Icon type="brain" className="w-8 h-8 text-white" animate={false} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <p className="text-gray-600 leading-relaxed">
                Serene combines cutting-edge AI technology with evidence-based therapeutic frameworks, creating a safe, non-judgmental space for you to explore your feelings and develop healthy coping strategies.
              </p>
            </motion.div>
          </div>

          {/* Help Center Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
                <p className="text-sm text-gray-600">Chat with our support team</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                <p className="text-sm text-gray-600">Comprehensive guides & tutorials</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                <p className="text-sm text-gray-600">support@serene-ai.com</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands who have found support and comfort with Serene. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-indigo-600 text-lg rounded-full font-semibold shadow-2xl hover:shadow-3xl transition inline-flex items-center justify-center"
              >
                Get Started Free
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition"
              >
                View Pricing
              </motion.button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-indigo-100 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <Icon type="check" className="w-4 h-4" animate={false} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon type="check" className="w-4 h-4" animate={false} />
                <span>Free plan forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon type="check" className="w-4 h-4" animate={false} />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon type="meditation" className="w-5 h-5 text-white" animate={false} />
                </div>
                <span className="text-xl font-bold text-white">Serene</span>
              </div>
              <p className="text-sm">Your compassionate AI companion for mental wellness.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm flex items-center gap-2">&copy; 2024 Serene. All rights reserved. Made with <Icon type="heart" className="w-4 h-4 text-red-500" animate={false} /> for mental wellness.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
