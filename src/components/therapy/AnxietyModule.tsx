'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AnxietyModuleProps {
  onComplete: (results: any) => void
}

export default function AnxietyModule({ onComplete }: AnxietyModuleProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | null>(null)
  const [breathingCount, setBreathingCount] = useState(0)

  const steps = [
    {
      id: 'introduction',
      title: 'Anxiety Management',
      description: 'This guided exercise will help you manage anxiety through breathing techniques and cognitive reframing.'
    },
    {
      id: 'assessment',
      title: 'Anxiety Assessment',
      description: 'Let\'s understand your current anxiety levels.',
      questions: [
        {
          id: 'anxietyLevel',
          text: 'On a scale of 1-10, how anxious are you feeling right now?',
          type: 'slider',
          min: 1,
          max: 10
        },
        {
          id: 'physicalSymptoms',
          text: 'What physical symptoms are you experiencing?',
          type: 'checkbox',
          options: ['Rapid heartbeat', 'Sweating', 'Trembling', 'Shortness of breath', 'Dizziness', 'Nausea']
        },
        {
          id: 'triggers',
          text: 'What situations or thoughts trigger your anxiety?',
          type: 'text'
        }
      ]
    },
    {
      id: 'breathing',
      title: 'Guided Breathing Exercise',
      description: 'Let\'s practice deep breathing to calm your nervous system.'
    },
    {
      id: 'reframing',
      title: 'Cognitive Reframing',
      description: 'Let\'s challenge anxious thoughts and reframe them in a more balanced way.',
      questions: [
        {
          id: 'anxiousThought',
          text: 'What anxious thought would you like to work on?',
          type: 'text'
        },
        {
          id: 'evidenceFor',
          text: 'What evidence supports this thought?',
          type: 'text'
        },
        {
          id: 'evidenceAgainst',
          text: 'What evidence contradicts this thought?',
          type: 'text'
        },
        {
          id: 'balancedThought',
          text: 'What would be a more balanced perspective?',
          type: 'text'
        }
      ]
    },
    {
      id: 'summary',
      title: 'Summary',
      description: 'Here\'s what we\'ve covered in this session.'
    }
  ]

  const handleResponse = (questionId: string, value: any) => {
    setResponses({
      ...responses,
      [questionId]: value
    })
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(responses)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const startBreathingExercise = () => {
    setBreathingPhase('inhale')
    setBreathingCount(4)
    
    const countdown = setInterval(() => {
      setBreathingCount(prev => {
        if (prev <= 1) {
          // Move to next phase
          if (breathingPhase === 'inhale') {
            setBreathingPhase('hold')
            return 4
          } else if (breathingPhase === 'hold') {
            setBreathingPhase('exhale')
            return 6
          } else {
            setBreathingPhase('inhale')
            return 4
          }
        }
        return prev - 1
      })
    }, 1000)
    
    // Stop after 60 seconds
    setTimeout(() => {
      clearInterval(countdown)
      setBreathingPhase(null)
    }, 60000)
  }

  const renderStep = () => {
    const step = steps[currentStep]
    
    switch (step.id) {
      case 'introduction':
        return (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
            <p className="text-gray-600 mb-8">{step.description}</p>
            <button
              onClick={nextStep}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Begin Exercise
            </button>
          </div>
        )
      
      case 'assessment':
        return (
          <div className="py-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 mb-6">{step.description}</p>
            
            <div className="space-y-6">
              {step.questions?.map((question) => (
                <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {question.text}
                  </label>
                  
                  {question.type === 'slider' && (
                    <div>
                      <input
                        type="range"
                        min={question.min}
                        max={question.max}
                        value={responses[question.id] || question.min}
                        onChange={(e) => handleResponse(question.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{question.min}</span>
                        <span className="font-medium text-indigo-600">{responses[question.id] || question.min}</span>
                        <span>{question.max}</span>
                      </div>
                    </div>
                  )}
                  
                  {question.type === 'checkbox' && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${question.id}-${option}`}
                            checked={responses[question.id]?.includes(option) || false}
                            onChange={(e) => {
                              const current = responses[question.id] || []
                              if (e.target.checked) {
                                handleResponse(question.id, [...current, option])
                              } else {
                                handleResponse(question.id, current.filter((item: string) => item !== option))
                              }
                            }}
                            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          />
                          <label htmlFor={`${question.id}-${option}`} className="ml-2 text-gray-700">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <textarea
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponse(question.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                      placeholder="Type your response here..."
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'breathing':
        return (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
            <p className="text-gray-600 mb-8">{step.description}</p>
            
            {!breathingPhase ? (
              <div>
                <button
                  onClick={startBreathingExercise}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition mb-6"
                >
                  Start Breathing Exercise
                </button>
                <p className="text-sm text-gray-500">
                  This exercise will guide you through deep breathing for 60 seconds
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="relative w-64 h-64 mx-auto">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-indigo-100"
                    animate={{
                      scale: breathingPhase === 'inhale' ? 1.2 : breathingPhase === 'exhale' ? 0.8 : 1,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-8 rounded-full bg-indigo-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-800 capitalize">
                        {breathingPhase}
                      </div>
                      <div className="text-4xl font-bold text-indigo-900 mt-2">
                        {breathingCount}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-gray-600">
                  {breathingPhase === 'inhale' && 'Breathe in slowly through your nose...'}
                  {breathingPhase === 'hold' && 'Hold your breath...'}
                  {breathingPhase === 'exhale' && 'Exhale slowly through your mouth...'}
                </div>
              </div>
            )}
          </div>
        )
      
      case 'reframing':
        return (
          <div className="py-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 mb-6">{step.description}</p>
            
            <div className="space-y-6">
              {step.questions?.map((question) => (
                <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {question.text}
                  </label>
                  <textarea
                    value={responses[question.id] || ''}
                    onChange={(e) => handleResponse(question.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Type your response here..."
                  />
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'summary':
        return (
          <div className="py-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
            <p className="text-gray-600 mb-6">{step.description}</p>
            
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-indigo-900 mb-3">Key Takeaways</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>You practiced deep breathing to activate your body's relaxation response</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>You identified and challenged anxious thoughts through cognitive reframing</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>You developed more balanced perspectives on challenging situations</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">Your Responses</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Anxiety Level:</span> {responses.anxietyLevel || 'Not recorded'}
                </div>
                <div>
                  <span className="font-medium">Physical Symptoms:</span> {responses.physicalSymptoms?.join(', ') || 'None recorded'}
                </div>
                <div>
                  <span className="font-medium">Triggers:</span> {responses.triggers || 'Not recorded'}
                </div>
                <div>
                  <span className="font-medium">Anxious Thought:</span> {responses.anxiousThought || 'Not recorded'}
                </div>
                <div>
                  <span className="font-medium">Balanced Perspective:</span> {responses.balancedThought || 'Not recorded'}
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full"
    >
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {renderStep()}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Back
        </button>
        
        <button
          onClick={nextStep}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </motion.div>
  )
}