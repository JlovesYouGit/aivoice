'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Icon from '../common/Icon'

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string) => void
}

export default function SubscriptionPlans({ onSelectPlan }: SubscriptionPlansProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      tagline: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      description: 'Basic access to Serene AI',
      features: [
        { text: '2000 token context window', included: true },
        { text: 'Text-based conversations', included: true },
        { text: 'Basic emotional support', included: true },
        { text: 'Limited to 10 messages/day', included: true },
        { text: 'Community support', included: true },
        { text: 'Voice responses', included: false },
        { text: 'Priority support', included: false },
        { text: 'Advanced analytics', included: false }
      ],
      cta: 'Start Free',
      popular: false,
      color: 'gray'
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'Most popular choice',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Enhanced therapeutic experience',
      features: [
        { text: 'Unlimited context window', included: true },
        { text: 'Unlimited messages', included: true },
        { text: 'Voice-enabled conversations', included: true },
        { text: 'Advanced emotional analysis', included: true },
        { text: 'Priority response times', included: true },
        { text: 'Personalized insights', included: true },
        { text: 'Mood tracking & analytics', included: true },
        { text: 'Email support', included: true }
      ],
      cta: 'Choose Premium',
      popular: true,
      color: 'indigo'
    },
    {
      id: 'pro',
      name: 'Professional',
      tagline: 'For serious practitioners',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'Professional-grade support',
      features: [
        { text: 'Everything in Premium', included: true },
        { text: '24/7 priority availability', included: true },
        { text: 'Specialized therapy modules', included: true },
        { text: 'Crisis intervention tools', included: true },
        { text: 'Health app integrations', included: true },
        { text: 'Personalized therapy plans', included: true },
        { text: 'Advanced voice customization', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'API access', included: true }
      ],
      cta: 'Go Pro',
      popular: false,
      color: 'purple'
    }
  ]

  const getPrice = (plan: typeof plans[0]) => {
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly / 12
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`
  }

  const getSavings = () => {
    if (billingCycle === 'yearly') {
      return 'Save 17%'
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Choose Your{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Perfect Plan
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Select the plan that best fits your mental wellness journey. Upgrade, downgrade, or cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full font-medium transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            {getSavings() && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {getSavings()}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Plans grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onHoverStart={() => setHoveredPlan(plan.id)}
            onHoverEnd={() => setHoveredPlan(null)}
            className={`relative rounded-3xl overflow-hidden transition-all ${
              plan.popular 
                ? 'ring-4 ring-indigo-600 shadow-2xl bg-white' 
                : 'bg-white shadow-xl hover:shadow-2xl'
            }`}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute top-0 right-0 left-0">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold text-center py-2 shadow-md flex items-center justify-center gap-2">
                  <Icon type="star" className="w-4 h-4" animate={false} />
                  MOST POPULAR
                </div>
              </div>
            )}
            
            <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
              {/* Plan header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{plan.tagline}</p>
                
                {/* Price */}
                <div className="flex items-baseline mb-2">
                  <span className={`text-5xl font-bold bg-gradient-to-r from-${plan.color}-600 to-${plan.color}-700 bg-clip-text text-transparent`}>
                    {getPrice(plan)}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'month'}
                    </span>
                  )}
                </div>
                
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <p className="text-sm text-gray-500">
                    Billed ${plan.price.yearly.toFixed(2)} annually
                  </p>
                )}
                
                <p className="text-gray-600 mt-3">{plan.description}</p>
              </div>

              {/* CTA button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl mb-6 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : plan.id === 'free'
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                }`}
              >
                {plan.cta}
              </motion.button>

              {/* Features list */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 mb-3">What's included:</p>
                {plan.features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start transition-all ${
                      feature.included ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    {feature.included ? (
                      <svg 
                        className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg 
                        className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hover effect overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredPlan === plan.id ? 0.05 : 0 }}
              className={`absolute inset-0 bg-gradient-to-br from-${plan.color}-500 to-${plan.color}-600 pointer-events-none`}
            />
          </motion.div>
        ))}
      </div>

      {/* FAQ section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl p-8 md:p-12"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h4>
            <p className="text-gray-600 text-sm">
              Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Is my data secure?</h4>
            <p className="text-gray-600 text-sm">
              Absolutely. All conversations are encrypted end-to-end. We never share your personal data.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600 text-sm">
              We accept all major credit cards, debit cards, and digital wallets through Stripe.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h4>
            <p className="text-gray-600 text-sm">
              Yes, we offer a 30-day money-back guarantee for all paid plans, no questions asked.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Trust badges */}
      <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-600">Secure & Encrypted</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-600">HIPAA Compliant</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-600">Certified Therapists</span>
        </div>
      </div>
    </div>
  )
}
