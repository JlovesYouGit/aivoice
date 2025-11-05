'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AnxietyModule from '@/components/therapy/AnxietyModule'

export default function AnxietyTherapyPage() {
  const [showModule, setShowModule] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleModuleComplete = (moduleResults: any) => {
    setResults(moduleResults)
    setSessionComplete(true)
    setShowModule(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Anxiety Management</h1>
            <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
              Evidence-based techniques to help you understand and manage anxiety
            </p>
          </div>

          {/* Content */}
          {!showModule && !sessionComplete && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Module</h2>
                  <p className="text-gray-600 mb-6">
                    This guided anxiety management session combines breathing exercises with cognitive 
                    behavioral techniques to help you understand and manage anxious feelings.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Guided breathing exercises to calm your nervous system</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Cognitive reframing to challenge anxious thoughts</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">Personalized insights and coping strategies</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowModule(true)}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                  >
                    Start Anxiety Management Session
                  </button>
                </div>
                
                <div className="md:w-1/2">
                  <div className="bg-indigo-50 rounded-xl p-6 h-full">
                    <h3 className="font-bold text-indigo-900 mb-4">What to Expect</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Duration</h4>
                        <p className="text-gray-600">15-20 minutes</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Techniques</h4>
                        <p className="text-gray-600">Breathing exercises, cognitive reframing</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Outcome</h4>
                        <p className="text-gray-600">Reduced anxiety, improved coping skills</p>
                      </div>
                      <div className="pt-4">
                        <p className="text-sm text-gray-500 italic">
                          "This module has helped thousands of users develop effective strategies 
                          for managing anxiety in their daily lives."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModule && (
            <div className="flex justify-center">
              <AnxietyModule onComplete={handleModuleComplete} />
            </div>
          )}

          {sessionComplete && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Complete!</h2>
              <p className="text-gray-600 mb-8">
                Great job! You've completed the anxiety management session. The techniques you've 
                practiced can be used whenever you feel anxious.
              </p>
              
              <div className="bg-indigo-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-bold text-indigo-900 mb-4">Your Results</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Anxiety Level</p>
                    <p className="font-medium">{results?.anxietyLevel || 'Not recorded'}/10</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Physical Symptoms</p>
                    <p className="font-medium">{results?.physicalSymptoms?.length || 0} reported</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Thoughts Reframed</p>
                    <p className="font-medium">1 completed</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Breathing Exercise</p>
                    <p className="font-medium">Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSessionComplete(false)
                    setShowModule(true)
                  }}
                  className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Repeat Session
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-white border border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg font-medium hover:bg-indigo-50 transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Additional Resources */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Breathing Techniques</h3>
                <p className="text-gray-600 text-sm">
                  Learn different breathing patterns for various anxiety situations
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Thought Journal</h3>
                <p className="text-gray-600 text-sm">
                  Track your thoughts and identify patterns over time
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Guided Meditations</h3>
                <p className="text-gray-600 text-sm">
                  Audio sessions for relaxation and mindfulness practice
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}