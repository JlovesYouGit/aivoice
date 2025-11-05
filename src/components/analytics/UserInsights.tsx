'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getUserAnalytics, getUserInsights } from '@/utils/analytics'

interface UserInsightsProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserInsights({ isOpen, onClose }: UserInsightsProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      const userAnalytics = getUserAnalytics()
      setAnalytics(userAnalytics)
      setInsights(getUserInsights(userAnalytics))
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-900">Your Wellness Insights</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {analytics && (
            <div className="space-y-6">
              {/* Engagement Score */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">Engagement Score</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-indigo-600 h-4 rounded-full"
                      style={{ width: `${analytics.engagementScore}%` }}
                    ></div>
                  </div>
                  <span className="ml-4 text-lg font-bold text-indigo-900">{analytics.engagementScore}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on your session frequency and message activity
                </p>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{analytics.totalSessions}</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{analytics.totalMessages}</div>
                  <div className="text-sm text-gray-600">Messages</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{analytics.voiceUsage}%</div>
                  <div className="text-sm text-gray-600">Voice Usage</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600 capitalize">{analytics.preferredTime}</div>
                  <div className="text-sm text-gray-600">Preferred Time</div>
                </div>
              </div>

              {/* Personalized Insights */}
              <div>
                <h3 className="font-semibold text-indigo-900 mb-3">Personalized Insights</h3>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-lg">
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emotional Trends */}
              {Object.keys(analytics.emotionalTrends).length > 0 && (
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-3">Emotional Trends</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(analytics.emotionalTrends).map(([emotion, count]) => (
                      <span
                        key={emotion}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {emotion} ({count as number})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}