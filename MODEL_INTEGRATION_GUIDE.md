# Model Integration Guide for Therapeutic AI Assistant

## Overview

This guide explains how to properly integrate ONNX models with the Therapeutic AI Assistant application, focusing on prompt engineering and behavior guidance rather than hardcoded responses.

## Current Implementation

The current system uses advanced prompt engineering to guide response generation:

### Prompt Structure

The system uses a structured prompt format that includes:

1. **System Instructions** - Defines the AI's role, personality, and boundaries
2. **Conversation History** - Maintains context through dialogue turns
3. **Behavioral Guidelines** - Ensures appropriate therapeutic responses

### Key Components

```typescript
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
```

## ONNX Model Integration

### 1. Model Requirements

For proper therapeutic AI functionality, use models that support:

- **Instruction Following** - Ability to follow system prompts
- **Role Playing** - Can adopt specific personas
- **Context Window** - Supports multi-turn conversations
- **Token Streaming** - Can generate tokens progressively

### 2. Recommended Models

1. **TinyLlama-1.1B-Chat-v1.0** (already downloaded)
2. **Mistral-7B-Instruct-v0.2** (requires download)
3. **Phi-2** (compact and effective)

### 3. Integration Steps

#### Step 1: Load the Model

```typescript
import { InferenceSession } from 'onnxruntime-node';

private async initializeModel(): Promise<void> {
  try {
    const modelPath = path.join(MODELS_DIR, 'model.onnx');
    if (fs.existsSync(modelPath)) {
      this.session = await InferenceSession.create(modelPath);
      this.isModelLoaded = true;
      console.log('ONNX model loaded successfully');
    }
  } catch (error) {
    console.error('Error loading ONNX model:', error);
  }
}
```

#### Step 2: Tokenize Input

```typescript
import { pipeline } from 'tokenizers';

private async tokenizeInput(prompt: string): Promise<number[]> {
  // Use the downloaded tokenizer files
  const tokenizerPath = path.join(MODELS_DIR, 'tokenizer.json');
  // Implementation would depend on the tokenizers library
  // This is a simplified example
  return [1, 2, 3]; // Placeholder token IDs
}
```

#### Step 3: Generate Response

```typescript
public async generateModelResponse(formattedPrompt: string): Promise<string> {
  if (!this.session) {
    throw new Error('Model not loaded');
  }

  // Tokenize the prompt
  const inputTokens = await this.tokenizeInput(formattedPrompt);
  
  // Convert to tensor
  const inputTensor = new Tensor('int64', 
    BigInt64Array.from(inputTokens.map(id => BigInt(id))), 
    [1, inputTokens.length]
  );
  
  // Run inference
  const results = await this.session.run({ input_ids: inputTensor });
  
  // Decode output (simplified)
  const outputTokens = Array.from(results[this.session.outputNames[0]].data as any);
  const response = await this.decodeTokens(outputTokens);
  
  return response;
}
```

## Prompt Engineering Best Practices

### 1. Role Definition

Clearly define the AI's role and responsibilities:

```
<|system|>
You are Serene, a compassionate and professional Therapeutic AI Assistant.
Your role is to provide emotional support and guidance while maintaining professional boundaries.
<|end|>
```

### 2. Behavioral Guidelines

Specify how the AI should behave:

- Use empathetic language
- Avoid judgment
- Ask open-ended questions
- Encourage self-reflection
- Maintain appropriate boundaries

### 3. Context Management

Maintain conversation history:

```
<|user|>
I've been feeling really anxious lately.
<|end|>

<|assistant|>
I understand how challenging anxiety can be. Can you tell me more about what's been triggering these feelings?
<|end|>

<|user|>
It's mostly work-related stress.
<|end|>

<|assistant|>
```

## Response Generation Flow

### 1. Format the Prompt

Structure the input with system instructions and conversation history.

### 2. Generate Tokens

Use the model to generate response tokens progressively.

### 3. Stream Output

Send tokens to the frontend as they're generated for real-time display.

### 4. Post-process Response

Clean and format the final response for display.

## Streaming Implementation

### Backend (API Route)

```typescript
export async function POST(request: Request) {
  // ... validation ...
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Generate streaming response
        for await (const chunk of localChatService.generateStreamingResponse(messages)) {
          const text = new TextEncoder().encode(chunk);
          controller.enqueue(text);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
}
```

### Frontend (Component)

```typescript
const handleSendMessage = async (message: string) => {
  // Add user message
  // ...
  
  // Create streaming response
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  
  // Process streaming response
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  // Add empty assistant message for streaming
  // ...
  
  // Read chunks and update message
  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    // Update assistant message with new chunk
    // ...
  }
};
```

## Testing and Validation

### 1. Response Quality

- Check for appropriate tone and empathy
- Verify boundary maintenance
- Ensure helpfulness and relevance

### 2. Safety

- Test for harmful content generation
- Verify boundary adherence
- Check for consistent persona

### 3. Performance

- Monitor response times
- Check memory usage
- Validate token generation quality

## Future Enhancements

### 1. Advanced Features

- Emotion detection from text
- Personalized response adaptation
- Multi-turn conversation memory
- Contextual response generation

### 2. Model Improvements

- Fine-tuning on therapeutic datasets
- Specialized models for different conditions
- Multi-modal capabilities (voice, text)

## Conclusion

This guide provides a framework for integrating ONNX models with proper prompt engineering and behavior guidance. The current implementation already demonstrates these principles with enhanced response generation, preparing the system for full model integration when ONNX models are available.