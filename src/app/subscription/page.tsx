'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SubscriptionPlans from '@/components/payment/SubscriptionPlans'

interface UserSubscription {
  planId: 'free' | 'premium' | 'pro'
  planName: string
  features: string[]
  renewalDate?: string
  status: 'active' | 'cancelled' | 'expired'
}

export default function SubscriptionManagement() {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    setTimeout(() => {
      setCurrentSubscription({
        planId: 'premium',
        planName: 'Premium Plan',
        features: [
          'Unlimited context window',
          'Voice-enabled conversations',
          'Advanced emotional analysis',
          'Priority response times',
          'Personalized insights',
          'Mood tracking & analytics'
        ],
        renewalDate: '2023-12-31',
        status: 'active'
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleSelectPlan = (planId: string) => {
    console.log('Selected plan:', planId)
    // In a real app, this would redirect to the payment page
    alert(`You selected the ${planId} plan. In a real app, this would proceed to payment.`)
  }

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      // In a real implementation, this would call an API to cancel the subscription
      alert('Subscription cancelled. In a real app, this would be processed immediately.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-indigo-900">Loading subscription details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Subscription Management</h1>
            <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
              Manage your subscription plan and billing information
            </p>
          </div>

          {currentSubscription && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentSubscription.planName}</h2>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentSubscription.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                    </span>
                    {currentSubscription.renewalDate && (
                      <p className="text-gray-600">
                        Renews on: <span className="font-medium">{currentSubscription.renewalDate}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
                  >
                    Cancel Subscription
                  </motion.button>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
                <ul className="space-y-2">
                  {currentSubscription.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg 
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Plan</h2>
            <p className="text-gray-600 mb-8">
              Upgrade or downgrade your plan at any time. Changes will take effect at the end of your current billing period.
            </p>
            
            <SubscriptionPlans onSelectPlan={handleSelectPlan} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}