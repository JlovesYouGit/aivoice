// Utility functions for subscription feature gating

export type SubscriptionPlan = 'free' | 'premium' | 'pro';

export interface PlanFeatures {
  voiceEnabled: boolean;
  contextWindow: number;
  prioritySupport: boolean;
  moodTracking: boolean;
  specializedModules: boolean;
  crisisIntervention: boolean;
  healthAppIntegration: boolean;
  personalizedPlans: boolean;
}

// Define features for each plan
export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
  free: {
    voiceEnabled: false,
    contextWindow: 2000,
    prioritySupport: false,
    moodTracking: false,
    specializedModules: false,
    crisisIntervention: false,
    healthAppIntegration: false,
    personalizedPlans: false
  },
  premium: {
    voiceEnabled: true,
    contextWindow: Infinity, // Unlimited
    prioritySupport: true,
    moodTracking: true,
    specializedModules: false,
    crisisIntervention: false,
    healthAppIntegration: false,
    personalizedPlans: false
  },
  pro: {
    voiceEnabled: true,
    contextWindow: Infinity, // Unlimited
    prioritySupport: true,
    moodTracking: true,
    specializedModules: true,
    crisisIntervention: true,
    healthAppIntegration: true,
    personalizedPlans: true
  }
};

/**
 * Check if a user has access to a specific feature based on their subscription plan
 */
export function hasFeature(plan: SubscriptionPlan, feature: keyof PlanFeatures): boolean {
  return (PLAN_FEATURES[plan] as any)[feature] as boolean;
}

/**
 * Get the features available for a specific subscription plan
 */
export function getPlanFeatures(plan: SubscriptionPlan): PlanFeatures {
  return PLAN_FEATURES[plan];
}

/**
 * Check if a user can use voice features
 */
export function canUseVoice(plan: SubscriptionPlan): boolean {
  return hasFeature(plan, 'voiceEnabled');
}

/**
 * Get the context window limit for a plan
 */
export function getContextWindowLimit(plan: SubscriptionPlan): number {
  return PLAN_FEATURES[plan].contextWindow;
}