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
    
    const { message } = validation.data

    // Create chat message history (in a real implementation, this would come from session)
    const messages: ChatMessage[] = [
      { role: 'user', content: message }
    ];

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