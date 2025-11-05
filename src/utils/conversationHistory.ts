// Utility functions for managing conversation history

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface ConversationHistory {
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const MAX_HISTORY_LENGTH = 20; // Maximum number of messages to retain
const STORAGE_KEY = 'serene_conversation_history';

/**
 * Get conversation history from localStorage
 */
export function getConversationHistory(): ConversationHistory | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    return null;
  }
}

/**
 * Save conversation history to localStorage
 */
export function saveConversationHistory(history: ConversationHistory): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving conversation history:', error);
  }
}

/**
 * Initialize a new conversation history
 */
export function initializeConversationHistory(): ConversationHistory {
  const now = Date.now();
  return {
    messages: [],
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Add a message to the conversation history
 */
export function addMessageToHistory(history: ConversationHistory, message: Message): ConversationHistory {
  const updatedHistory = {
    ...history,
    messages: [...history.messages, message].slice(-MAX_HISTORY_LENGTH), // Keep only the last N messages
    updatedAt: Date.now()
  };
  
  saveConversationHistory(updatedHistory);
  return updatedHistory;
}

/**
 * Get the last N messages from history for context
 */
export function getContextMessages(history: ConversationHistory, count: number = 10): Message[] {
  return history.messages.slice(-count);
}

/**
 * Clear conversation history
 */
export function clearConversationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing conversation history:', error);
  }
}

/**
 * Get conversation history as a formatted string for AI context
 */
export function getHistoryAsString(history: ConversationHistory, count: number = 10): string {
  const contextMessages = getContextMessages(history, count);
  return contextMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
}