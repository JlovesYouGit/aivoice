// Utility functions for analytics and user insights

export interface UserAnalytics {
  totalMessages: number;
  totalSessions: number;
  firstSessionDate: number;
  lastSessionDate: number;
  avgMessagesPerSession: number;
  engagementScore: number; // 0-100
  preferredTime: string; // 'morning', 'afternoon', 'evening', 'night'
  emotionalTrends: Record<string, number>; // e.g., { 'anxiety': 15, 'depression': 8, 'stress': 12 }
  voiceUsage: number; // percentage of sessions with voice enabled
  subscriptionChanges: number; // number of subscription changes
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  endTime: number;
  messageCount: number;
  voiceEnabled: boolean;
  topics: string[];
  emotionalKeywords: string[];
}

const ANALYTICS_STORAGE_KEY = 'serene_user_analytics';
const SESSIONS_STORAGE_KEY = 'serene_user_sessions';

/**
 * Initialize user analytics
 */
export function initializeUserAnalytics(): UserAnalytics {
  return {
    totalMessages: 0,
    totalSessions: 0,
    firstSessionDate: Date.now(),
    lastSessionDate: Date.now(),
    avgMessagesPerSession: 0,
    engagementScore: 0,
    preferredTime: 'evening',
    emotionalTrends: {},
    voiceUsage: 0,
    subscriptionChanges: 0
  };
}

/**
 * Get user analytics from localStorage
 */
export function getUserAnalytics(): UserAnalytics {
  try {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return initializeUserAnalytics();
  } catch (error) {
    console.error('Error retrieving user analytics:', error);
    return initializeUserAnalytics();
  }
}

/**
 * Save user analytics to localStorage
 */
export function saveUserAnalytics(analytics: UserAnalytics): void {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving user analytics:', error);
  }
}

/**
 * Track a new message
 */
export function trackMessage(analytics: UserAnalytics): UserAnalytics {
  const updatedAnalytics = {
    ...analytics,
    totalMessages: analytics.totalMessages + 1,
    lastSessionDate: Date.now()
  };
  
  // Update engagement score based on activity
  updatedAnalytics.engagementScore = calculateEngagementScore(updatedAnalytics);
  
  saveUserAnalytics(updatedAnalytics);
  return updatedAnalytics;
}

/**
 * Track a new session
 */
export function trackSession(analytics: UserAnalytics, sessionData: SessionData): UserAnalytics {
  const updatedAnalytics = {
    ...analytics,
    totalSessions: analytics.totalSessions + 1,
    lastSessionDate: Date.now(),
    voiceUsage: calculateVoiceUsage(analytics, sessionData.voiceEnabled)
  };
  
  // Update preferred time based on session start time
  updatedAnalytics.preferredTime = getPreferredTime(sessionData.startTime, analytics.preferredTime);
  
  // Update emotional trends
  updatedAnalytics.emotionalTrends = updateEmotionalTrends(analytics.emotionalTrends, sessionData.emotionalKeywords);
  
  saveUserAnalytics(updatedAnalytics);
  return updatedAnalytics;
}

/**
 * Track subscription change
 */
export function trackSubscriptionChange(analytics: UserAnalytics): UserAnalytics {
  const updatedAnalytics = {
    ...analytics,
    subscriptionChanges: analytics.subscriptionChanges + 1
  };
  
  saveUserAnalytics(updatedAnalytics);
  return updatedAnalytics;
}

/**
 * Calculate engagement score based on user activity
 */
function calculateEngagementScore(analytics: UserAnalytics): number {
  // Simple engagement calculation based on message frequency and session count
  const daysActive = (Date.now() - analytics.firstSessionDate) / (1000 * 60 * 60 * 24);
  const avgMessagesPerDay = analytics.totalMessages / Math.max(1, daysActive);
  const sessionFrequency = analytics.totalSessions / Math.max(1, daysActive);
  
  // Score based on activity (0-100)
  let score = 0;
  score += Math.min(50, avgMessagesPerDay * 10); // Up to 50 points for message frequency
  score += Math.min(30, sessionFrequency * 15); // Up to 30 points for session frequency
  score += Math.min(20, analytics.totalSessions); // Up to 20 points for total sessions
  
  return Math.min(100, Math.round(score));
}

/**
 * Calculate voice usage percentage
 */
function calculateVoiceUsage(analytics: UserAnalytics, currentSessionVoiceEnabled: boolean): number {
  if (analytics.totalSessions === 0) {
    return currentSessionVoiceEnabled ? 100 : 0;
  }
  
  const previousVoiceSessions = (analytics.voiceUsage / 100) * analytics.totalSessions;
  const newVoiceSessions = currentSessionVoiceEnabled ? previousVoiceSessions + 1 : previousVoiceSessions;
  const newTotalSessions = analytics.totalSessions + 1;
  
  return Math.round((newVoiceSessions / newTotalSessions) * 100);
}

/**
 * Determine preferred time based on session start time
 */
function getPreferredTime(sessionStartTime: number, currentPreferredTime: string): string {
  const date = new Date(sessionStartTime);
  const hour = date.getHours();
  
  let timeOfDay = '';
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }
  
  // For simplicity, we'll just return the time of this session
  // In a real implementation, you might track a histogram of usage times
  return timeOfDay;
}

/**
 * Update emotional trends based on session keywords
 */
function updateEmotionalTrends(currentTrends: Record<string, number>, newKeywords: string[]): Record<string, number> {
  const updatedTrends = { ...currentTrends };
  
  // Common emotional keywords to track
  const emotionalKeywords = [
    'anxiety', 'stress', 'depression', 'sadness', 'loneliness', 'anger', 
    'frustration', 'worry', 'fear', 'hope', 'joy', 'peace', 'calm'
  ];
  
  newKeywords.forEach(keyword => {
    const normalizedKeyword = keyword.toLowerCase();
    if (emotionalKeywords.includes(normalizedKeyword)) {
      updatedTrends[normalizedKeyword] = (updatedTrends[normalizedKeyword] || 0) + 1;
    }
  });
  
  return updatedTrends;
}

/**
 * Get user insights based on analytics
 */
export function getUserInsights(analytics: UserAnalytics): string[] {
  const insights: string[] = [];
  
  // Engagement insights
  if (analytics.engagementScore > 80) {
    insights.push("You're highly engaged with Serene! Your consistent usage shows a strong commitment to your mental wellness journey.");
  } else if (analytics.engagementScore > 50) {
    insights.push("You're maintaining a good level of engagement with Serene. Keep up the regular conversations to maximize benefits.");
  } else {
    insights.push("Consider engaging more regularly with Serene to get the most out of your mental wellness support.");
  }
  
  // Voice usage insights
  if (analytics.voiceUsage > 70) {
    insights.push("You frequently use voice conversations, which can make interactions feel more natural and comforting.");
  } else if (analytics.voiceUsage > 30) {
    insights.push("You occasionally use voice features. Try using them more often for a more immersive experience.");
  } else {
    insights.push("Voice conversations can enhance your experience. Consider trying them for a more personal interaction.");
  }
  
  // Time preference insights
  const timeInsights: Record<string, string> = {
    'morning': "You tend to engage with Serene in the morning. This is a great time to set a positive tone for your day.",
    'afternoon': "You often connect with Serene in the afternoon. This can be a good time for a mental wellness check-in.",
    'evening': "Evening is your preferred time to chat with Serene. This is perfect for reflecting on your day.",
    'night': "You frequently engage with Serene at night. This can be helpful for processing the day's events before sleep."
  };
  insights.push(timeInsights[analytics.preferredTime]);
  
  // Emotional trend insights
  const emotionalEntries = Object.entries(analytics.emotionalTrends);
  if (emotionalEntries.length > 0) {
    // Find the most mentioned emotion
    const sortedEmotions = emotionalEntries.sort((a, b) => b[1] - a[1]);
    const topEmotion = sortedEmotions[0][0];
    insights.push(`You've mentioned "${topEmotion}" frequently in our conversations. It might be helpful to explore this further.`);
  }
  
  return insights;
}

/**
 * Get weekly analytics summary
 */
export function getWeeklySummary(analytics: UserAnalytics): string {
  const daysSinceStart = Math.ceil((Date.now() - analytics.firstSessionDate) / (1000 * 60 * 60 * 24));
  const sessionsPerWeek = (analytics.totalSessions / Math.max(1, daysSinceStart)) * 7;
  const messagesPerSession = analytics.totalMessages / Math.max(1, analytics.totalSessions);
  
  return `Weekly Summary: ${analytics.totalSessions} sessions, ${analytics.totalMessages} messages, ${sessionsPerWeek.toFixed(1)} sessions/week, ${messagesPerSession.toFixed(1)} messages/session`;
}