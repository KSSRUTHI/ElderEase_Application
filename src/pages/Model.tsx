import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = "AIzaSyAd4tdhVIqIXLjzBeTwDkhmfemir17_h6E"; // Note: In production, use environment variables
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Default information that can be referenced
const DEFAULT_USER_DATA = `
User's Default Information:
- Medications: 
  • Lisinopril (10mg) - morning
  • Metformin (500mg) - with breakfast and dinner
  • Atorvastatin (20mg) - at bedtime
- Upcoming Appointments:
  • Dr. Smith (Cardiologist) - May 15, 2:30 PM
  • Annual Physical - June 3, 10:00 AM
- Emergency Contacts:
  • Daughter: Mary Johnson - (555) 123-4567
  • Neighbor: Bob Wilson - (555) 987-6543
  • Primary Care: Dr. Patel - (555) 456-7890
`;

const ELDER_CARE_CONTEXT = `
You are ElderEase Assistant, an AI companion designed to support elderly individuals. 
Your responses should be:
- Extremely concise (1-2 sentences max)
- Directly actionable
- Use simple language
- Assume standard information is available
- For reminders/appointments, just confirm creation

Response rules:
1. For medication reminders: Just confirm time/medication
2. For appointments: Confirm date/time/doctor
3. For contacts: Provide name/number immediately
4. For health questions: Give 1 most important action
5. Never ask follow-up questions
6. Use default data when available

Example responses:
"Reminder set for Lisinopril at 8:30 PM."
"Your next cardiology appointment is May 15 at 2:30 PM with Dr. Smith."
"Mary Johnson can be reached at (555) 123-4567."
"Please sit down and drink water. I'll alert your daughter."
`;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const generateElderCareResponse = async (
  prompt: string, 
  history: Message[] = []
): Promise<string> => {
  try {
    // Pre-process the prompt to handle common patterns directly
    const lowerPrompt = prompt.toLowerCase();
    
    // Direct response patterns
    if (lowerPrompt.includes('remind')) {
      const timeMatch = prompt.match(/(\d{1,2}:\d{2}\s?(am|pm)?)/i);
      const time = timeMatch ? `at ${timeMatch[0]}` : 'as requested';
      return `Reminder set for medications ${time}.`;
    }
    
    if (lowerPrompt.includes('appointment')) {
      return "Your next appointment is May 15 at 2:30 PM with Dr. Smith.";
    }
    
    if (lowerPrompt.includes('contact') || lowerPrompt.includes('call')) {
      if (lowerPrompt.includes('daughter') || lowerPrompt.includes('mary')) {
        return "Mary Johnson: (555) 123-4567";
      }
      if (lowerPrompt.includes('doctor') || lowerPrompt.includes('patel')) {
        return "Dr. Patel: (555) 456-7890";
      }
      return "Emergency contacts: Mary (555) 123-4567, Dr. Patel (555) 456-7890";
    }

    // Build conversation history
    const chatHistory = [
      { role: 'user', parts: [{ text: ELDER_CARE_CONTEXT + DEFAULT_USER_DATA }] },
      { role: 'model', parts: [{ text: "Hello! I'm ElderEase. How can I help?" }] },
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    ];

    // Generate content with the new SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],      
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_MEDICAL", threshold: "BLOCK_ONLY_HIGH" }
      ],
      generationConfig: {
        temperature: 0.3, // Lower for more predictable responses
        topK: 20,
        topP: 0.7,
        maxOutputTokens: 100, // Strict limit for brevity
      }
    });

    // Extract and format the response
    let responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Force short responses
    responseText = responseText.split('\n')[0]; // Take only first line
    responseText = responseText.substring(0, 150); // Hard character limit
    
    if (!responseText.trim()) {
      return "Let me help with that.";
    }

    return formatForElderly(responseText);
  } catch (error) {
    console.error("AI Response Error:", error);
    return "I'll help with that right away.";
  }
};

function formatForElderly(text: string): string {
  // Highlight critical information
  const criticalTerms = ['now', 'emergency', 'call', 'alert', 'immediately'];
  criticalTerms.forEach(term => {
    text = text.replace(new RegExp(term, 'gi'), `**${term}**`);
  });
  
  // Remove any follow-up questions
  text = text.replace(/\?.*$/, '.');
  
  return text;
}