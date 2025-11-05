import { NextResponse } from 'next/server'
import { chatMessageSchema } from '@/utils/validation/schemas'
import { validateInput, handleValidationError } from '@/utils/validation/validate'
import { Errors } from '@/utils/errorHandler'
import { localChatService, ChatMessage } from '@/lib/ai/chat-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input using Zod
    const validation = validateInput(chatMessageSchema, body)
    if (!validation.success) {
      return handleValidationError(validation.errors)
    }
    
    const { message, history } = validation.data

    // Create chat message history
    // If history is provided, use it; otherwise create a simple history
    let messages: ChatMessage[] = [];
    
    if (history && Array.isArray(history)) {
      // Convert history to ChatMessage format
      messages = history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
    } else {
      // Default to just the current message
      messages = [
        { role: 'user', content: message }
      ];
    }

    // Generate response using local AI service
    const result = await localChatService.generateResponse(messages);
    
    if (!result.success) {
      return Errors.internal(new Error(result.error || 'Failed to generate response'));
    }

    return NextResponse.json({
      success: true,
      response: result.response
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return Errors.internal(error)
  }
}