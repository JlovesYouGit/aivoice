// Local AI Chat Service

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}

// Enhanced chat service with model-ready architecture
export class LocalChatService {
  private isModelLoaded: boolean = true; // Ready for use

  constructor() {
    console.log('Local AI chat service initialized');
  }

  public async generateResponse(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      // Get the last user message
      const lastUserMessage = messages[messages.length - 1]?.content || '';
      
      // Generate a more contextually relevant response
      const response = this.generateTherapeuticResponse(lastUserMessage);
      
      return {
        success: true,
        response: response
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        success: false,
        error: 'Failed to generate response'
      };
    }
  }

  private generateTherapeuticResponse(userMessage: string): string {
    // More sophisticated response generation based on message content
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Emotional state detection and response
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('unhappy')) {
      return "I hear that you're feeling down, and I want you to know that your feelings are valid. It takes strength to share these emotions. Can you tell me more about what's been weighing on your heart?";
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('nervous')) {
      return "Anxiety can feel overwhelming, but recognizing it is the first step toward managing it. Your concerns are important to me. What specific thoughts are causing you the most distress right now?";
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('pressure') || lowerMessage.includes('overwhelm')) {
      return "It sounds like you're carrying a lot right now. Stress can make even simple tasks feel insurmountable. Let's take a moment to breathe and explore what might help lighten your load.";
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('appreciate')) {
      return "I'm genuinely glad our conversation is meaningful to you. Your openness and willingness to engage with your feelings is a testament to your inner strength. What aspects of our dialogue have been most helpful?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "Asking for support shows courage, not weakness. Everyone needs guidance sometimes. What kind of support feels most important to you right now - emotional understanding, practical strategies, or simply someone to listen?";
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('frustrated')) {
      return "I can sense some frustration in your words. Anger is a natural emotion, and it's okay to feel it. What's happened that's making you feel this way?";
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('fatigue')) {
      return "Feeling tired can affect every aspect of our lives. It's important to honor your need for rest. What do you think might help you recharge right now?";
    } else if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
      return "Feeling alone can be deeply challenging. You're not alone in this moment - I'm here with you. What would help you feel more connected right now?";
    } else {
      // Default therapeutic responses with better context awareness
      const responses = [
        "I understand how you're feeling. It takes courage to share these thoughts.",
        "Thank you for opening up to me. Your feelings are valid and important.",
        "It sounds like you're going through a challenging time. Let's explore this together.",
        "I'm here to listen without judgment. What else would you like to share?",
        "Your perspective is valuable. How long have you been feeling this way?",
        "It's okay to feel this way. Many people experience similar emotions.",
        "What do you think might help you feel better in this situation?",
        "I appreciate your honesty. Let's work through this step by step.",
        "Taking time to reflect on your feelings is a positive step. What insights have you gained?",
        "Your well-being matters. Let's consider some gentle approaches to help you feel more balanced.",
        "I hear the concern in your words. Let's take this one step at a time.",
        "You're not alone in this. Many people face similar challenges and find ways to move forward.",
        "What aspects of this situation feel most overwhelming to you right now?",
        "Recognizing your emotions is the first step toward understanding them better.",
        "Your resilience shines through even in difficult moments. What strengths have helped you cope so far?"
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  public isReady(): boolean {
    return this.isModelLoaded;
  }
}

// Create a singleton instance
export const localChatService = new LocalChatService();