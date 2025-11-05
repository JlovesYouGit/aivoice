'use client'

import { motion } from 'framer-motion'

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string) => void
}

export default function SubscriptionPlans({ onSelectPlan }: SubscriptionPlansProps) {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic access to Serene',
      features: [
        '2000 context window',
        'Text-based conversations',
        'Basic emotional support',
        'Limited daily interactions'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'Enhanced therapeutic experience',
      features: [
        'Unlimited context window',
        'Voice-enabled conversations',
        'Advanced emotional analysis',
        'Priority response times',
        'Personalized insights',
        'Mood tracking & analytics'
      ],
      cta: 'Choose Premium',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      description: 'Professional-grade support',
      features: [
        'All Premium features',
        '24/7 availability',
        'Specialized therapy modules',
        'Crisis intervention tools',
        'Integration with health apps',
        'Personalized therapy plans'
      ],
      cta: 'Go Pro',
      popular: false
    }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
          Select the perfect plan for your mental wellness journey with Serene
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`rounded-2xl shadow-xl overflow-hidden ${
              plan.popular 
                ? 'ring-2 ring-indigo-600 relative bg-white' 
                : 'bg-white'
            }`}
          >
            {plan.popular && (
              <div className="bg-indigo-600 text-white text-sm font-bold text-center py-2">
                MOST POPULAR
              </div>
            )}
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold text-indigo-900">{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg 
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
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
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}