// Mock therapeutic responses
const therapeuticResponses = [
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
  "It's natural to have ups and downs. What coping strategies have worked for you in the past?",
  "I hear the concern in your words. Let's take this one step at a time.",
  "You're not alone in this. Many people face similar challenges and find ways to move forward.",
  "What aspects of this situation feel most overwhelming to you right now?",
  "Recognizing your emotions is the first step toward understanding them better."
];

export async function generateTherapeuticResponse(message: string): Promise<string> {
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Select a random therapeutic response
  const responseText = therapeuticResponses[Math.floor(Math.random() * therapeuticResponses.length)];
  
  return responseText;
}