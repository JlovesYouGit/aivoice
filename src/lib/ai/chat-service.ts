// Local AI Chat Service with Proper Prompt Engineering
import * as fs from 'fs';
import * as path from 'path';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}

// Define the AI's persona and behavior guidelines
const AI_PERSONA = {
  name: "Serene",
  role: "Therapeutic AI Assistant",
  personality: {
    empathetic: true,
    non_judgmental: true,
    supportive: true,
    professional: true,
    warm: true
  },
  expertise: [
    "Mental health support",
    "Emotional wellness",
    "Stress management",
    "Anxiety reduction",
    "Mindfulness techniques"
  ],
  communication_style: {
    tone: "calm and reassuring",
    language: "clear and accessible",
    approach: "collaborative and empowering"
  },
  boundaries: [
    "Not a replacement for professional therapy",
    "Cannot provide medical advice",
    "Encourages seeking professional help when needed",
    "Maintains confidentiality",
    "Does not make diagnoses"
  ]
};

// Enhanced chat service with proper prompt engineering
export class LocalChatService {
  private isModelLoaded: boolean = true;

  constructor() {
    console.log('Local AI chat service initialized with prompt engineering');
  }

  public async generateResponse(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      // Format the conversation with proper prompt engineering
      const formattedPrompt = this.formatPromptForModel(messages);
      
      // Generate response using prompt engineering approach
      const response = await this.generateModelResponse(formattedPrompt, messages);
      
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

  private formatPromptForModel(conversationHistory: ChatMessage[]): string {
    // Create a structured prompt that guides the model's behavior
    const systemPrompt = `
<|system|>
You are ${AI_PERSONA.name}, a compassionate and professional Therapeutic AI Assistant. Your role is to provide emotional support and guidance while maintaining professional boundaries.

Personality Traits:
- Empathetic: Show genuine understanding and care
- Non-judgmental: Accept all feelings without criticism
- Supportive: Encourage positive coping strategies
- Professional: Maintain appropriate boundaries
- Warm: Create a safe, welcoming environment

Areas of Expertise:
${AI_PERSONA.expertise.map(exp => `- ${exp}`).join('\n')}

Communication Style:
- Tone: ${AI_PERSONA.communication_style.tone}
- Language: ${AI_PERSONA.communication_style.language}
- Approach: ${AI_PERSONA.communication_style.approach}

Important Boundaries:
${AI_PERSONA.boundaries.map(boundary => `- ${boundary}`).join('\n')}

Instructions:
1. Listen actively to the user's concerns
2. Validate their emotions without judgment
3. Offer gentle guidance and coping strategies
4. Encourage self-reflection and personal insight
5. Suggest professional help when appropriate
6. Maintain a calm, supportive tone
7. Keep responses concise but meaningful
8. Ask open-ended questions to encourage dialogue
9. Personalize responses based on conversation context
10. Never claim to be a licensed therapist

Respond naturally as ${AI_PERSONA.name}, keeping in mind your therapeutic role and the user's emotional needs.
<|end|>

`;

    // Format the conversation history
    let conversation = systemPrompt;
    
    // Add conversation history
    for (const message of conversationHistory) {
      if (message.role === 'user') {
        conversation += `<|user|>\n${message.content}\n<|end|>\n`;
      } else if (message.role === 'assistant') {
        conversation += `<|assistant|>\n${message.content}\n<|end|>\n`;
      }
    }
    
    // Add the assistant's turn
    conversation += `<|assistant|>\n`;
    
    return conversation;
  }

  private async generateModelResponse(formattedPrompt: string, conversationHistory: ChatMessage[]): Promise<string> {
    // This is where we would integrate with the actual model
    // For now, we'll simulate a more intelligent response generation
    
    // Get the last user message for context
    const lastUserMessage = conversationHistory.length > 0 
      ? conversationHistory[conversationHistory.length - 1].content 
      : "";
    
    // Generate a contextually appropriate response based on the prompt structure
    return this.generateContextualResponse(lastUserMessage, formattedPrompt, conversationHistory);
  }

  private generateContextualResponse(userMessage: string, formattedPrompt: string, conversationHistory: ChatMessage[]): string {
    // Analyze the user's message and conversation context
    const lowerMessage = userMessage.toLowerCase();
    
    // Determine response based on emotional content and conversation flow
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('unhappy')) {
      return "I hear that you're feeling down, and I want you to know that your feelings are completely valid. It takes real courage to share these emotions. Can you tell me more about what's been weighing on your heart? I'm here to listen without judgment.";
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('nervous')) {
      return "Anxiety can feel overwhelming, but recognizing it is such an important first step. Your concerns matter to me. What specific thoughts are causing you the most distress right now? Sometimes talking through them can help us understand them better.";
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('pressure') || lowerMessage.includes('overwhelm')) {
      return "It sounds like you're carrying a lot right now. Stress can make even simple tasks feel insurmountable. Let's take a moment to breathe together. What feels like the most pressing concern for you today? Sometimes breaking things down can help lighten the load.";
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('appreciate')) {
      return "I'm genuinely touched that our conversation feels meaningful to you. Your openness and willingness to explore your feelings shows real strength. What aspects of our dialogue have been most helpful to you? I'd love to understand what resonates with you.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "Asking for support is a sign of wisdom, not weakness. Everyone needs guidance sometimes. What kind of support feels most important to you right now - emotional understanding, practical strategies, or simply having someone to listen? Let's explore what might be most helpful for your situation.";
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('frustrated')) {
      return "I can sense some frustration in your words, and it's completely okay to feel angry sometimes. Emotions like this are natural and valid. What's happened that's making you feel this way? Sometimes understanding the source of our frustration can help us process it more effectively.";
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('fatigue')) {
      return "Feeling tired can affect every aspect of our lives, both mentally and physically. It's important to honor your need for rest and recovery. What do you think might help you recharge right now? Sometimes the most nurturing thing we can do is give ourselves permission to rest.";
    } else if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
      return "Feeling alone can be deeply challenging, and I want you to know that you're not truly alone in this moment - I'm here with you. What would help you feel more connected right now? Sometimes reaching out, even in small ways, can begin to bridge that sense of isolation.";
    } else {
      // Generate a more dynamic response based on conversation context
      return this.generateDynamicResponse(conversationHistory);
    }
  }

  private generateDynamicResponse(conversationHistory: ChatMessage[]): string {
    // Look at the conversation history to generate a more contextual response
    const recentMessages = conversationHistory.slice(-4); // Last 4 messages
    const userMessages = recentMessages.filter(msg => msg.role === 'user');
    
    // If we have previous conversation context
    if (userMessages.length > 0) {
      const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
      const lowerLastMessage = lastUserMessage.toLowerCase();
      
      // Build on previous topics
      if (lowerLastMessage.includes('work') || lowerLastMessage.includes('job')) {
        return "I'm curious about how work is fitting into everything else in your life right now. Work can be such a significant part of our identity and daily experience. How are you feeling about the balance between your professional responsibilities and personal well-being?";
      } else if (lowerLastMessage.includes('family') || lowerLastMessage.includes('friend')) {
        return "Relationships can be such an important part of our lives, bringing both joy and complexity. How are your connections with family or friends influencing your current situation? Sometimes talking through our relationships can help us understand our own needs better.";
      } else if (lowerLastMessage.includes('sleep') || lowerLastMessage.includes('tired')) {
        return "I wonder how your rest and energy levels are affecting your overall well-being. Sleep and mental health are so closely connected. What does a good night's rest look like for you, and what might be getting in the way of that right now?";
      } else if (lowerLastMessage.includes('feel') || lowerLastMessage.includes('emotion')) {
        return "Understanding our emotions is such an important part of self-awareness. It sounds like you're really in tune with your inner experience. What do you think your feelings are trying to tell you right now? Sometimes our emotions are messengers with valuable insights.";
      }
    }
    
    // Default therapeutic responses with better flow
    const responses = [
      "I understand how you're feeling, and it takes real courage to share these thoughts with someone. What aspects of this situation feel most challenging to you right now?",
      "Thank you for opening up to me. Your feelings are not only valid but important. As we explore this together, what insights are beginning to emerge for you?",
      "It sounds like you're navigating a challenging time, and I appreciate your willingness to work through this. What would feel most supportive to you in this moment?",
      "I'm here to listen without judgment, and I can sense the depth of what you're experiencing. What else would you like to share about this?",
      "Your perspective is genuinely valuable, and I'm curious about how long you've been feeling this way. Sometimes understanding the timeline can help us see patterns.",
      "It's completely okay to feel this way - many people experience similar emotions. What do you think might help you feel more grounded right now?",
      "What you're going through matters, and I appreciate your honesty. As we talk through this, what aspects feel most important to address first?",
      "I hear the concern in your words, and I want you to know that your experience is valid. Let's take this one step at a time - what feels like the most pressing concern for you today?",
      "You're not alone in this - many people face similar challenges and find their way forward. What strengths do you feel you have that might help you navigate this?",
      "Recognizing your emotions is such an important first step toward understanding them better. What do you think your feelings might be trying to tell you right now?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  public isReady(): boolean {
    return this.isModelLoaded;
  }
}

// Create a singleton instance
export const localChatService = new LocalChatService();