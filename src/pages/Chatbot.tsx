import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Clock, 
  Calendar, 
  HeartPulse, 
  Pill, 
  Smile, 
  Settings,
  Loader2
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyAd4tdhVIqIXLjzBeTwDkhmfemir17_h6E');

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isFunction?: boolean;
  functionData?: any;
};

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{
      id: '1',
      text: `Hello ${user?.name || 'there'}! I'm your ElderEase companion. How can I help you today? You can ask me about:\n\n• Setting reminders\n• Scheduling appointments\n• Health questions\n• Or just chat with me!`,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [user?.name]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Check for function triggers
      if (await handleFunctions(input)) {
        setIsTyping(false);
        return;
      }

      // Otherwise, send to Gemini AI
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `
      You are ElderEase, a friendly AI companion designed to assist elderly users. 
      The user's name is ${user?.name || 'friend'}. 
      Respond in a warm, compassionate tone using simple language (8th grade reading level).
      Keep responses concise (1-3 sentences) unless more detail is requested.
      
      Current conversation context:
      ${messages.slice(-3).map(m => `${m.sender === 'user' ? 'User' : 'You'}: ${m.text}`).join('\n')}
      
      User's new message: ${input}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Add bot response
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: text,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFunctions = async (message: string): Promise<boolean> => {
    const lowerMessage = message.toLowerCase();
    
    // Check for reminder request
    if (lowerMessage.includes('remind me') || lowerMessage.includes('set a reminder')) {
      const reminderText = extractReminderText(message);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `I'll remind you: "${reminderText}"`,
        sender: 'bot',
        timestamp: new Date(),
        isFunction: true,
        functionData: { type: 'reminder', text: reminderText }
      }]);
      return true;
    }
    
    // Check for appointment scheduling
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      const appointmentDetails = extractAppointmentDetails(message);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `Let me schedule that appointment for you: ${appointmentDetails}`,
        sender: 'bot',
        timestamp: new Date(),
        isFunction: true,
        functionData: { type: 'appointment', details: appointmentDetails }
      }]);
      return true;
    }
    
    // Check for medication reminder
    if (lowerMessage.includes('medicine') || lowerMessage.includes('pill') || lowerMessage.includes('medication')) {
      const medDetails = extractMedicationDetails(message);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `I'll remind you about your medication: ${medDetails}`,
        sender: 'bot',
        timestamp: new Date(),
        isFunction: true,
        functionData: { type: 'medication', details: medDetails }
      }]);
      return true;
    }
    
    return false;
  };

  const extractReminderText = (message: string): string => {
    // Simple extraction - in a real app, you'd use more sophisticated NLP
    const reminderPhrases = ['remind me to', 'set a reminder for'];
    for (const phrase of reminderPhrases) {
      if (message.toLowerCase().includes(phrase)) {
        return message.substring(message.toLowerCase().indexOf(phrase) + phrase.length).trim();
      }
    }
    return message;
  };

  const extractAppointmentDetails = (message: string): string => {
    // Simple extraction - in a real app, you'd parse date/time properly
    return message.replace(/appointment|schedule/gi, '').trim();
  };

  const extractMedicationDetails = (message: string): string => {
    // Simple extraction
    return message.replace(/medicine|pill|medication/gi, '').trim();
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Voice input is not supported in your browser.",
        sender: 'bot',
        timestamp: new Date()
      }]);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // @ts-ignore - webkitSpeechRecognition is not in TypeScript's DOM types
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      inputRef.current?.focus();
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Sorry, I couldn't understand your voice. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    };

    recognition.start();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.isFunction) {
      return (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              {message.functionData.type === 'reminder' && <Clock className="text-blue-500" size={18} />}
              {message.functionData.type === 'appointment' && <Calendar className="text-blue-500" size={18} />}
              {message.functionData.type === 'medication' && <Pill className="text-blue-500" size={18} />}
            </div>
            <div>
              <p className="text-blue-800 font-medium">{message.text}</p>
              <button 
                className="mt-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition-colors"
                onClick={() => handleConfirmFunction(message)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Format message text with line breaks
    return message.text.split('\n').map((paragraph, i) => (
      <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
    ));
  };

  const handleConfirmFunction = (message: Message) => {
    setMessages(prev => prev.map(m => 
      m.id === message.id 
        ? { ...m, text: `${m.text} ✅ Confirmed!`, isFunction: false } 
        : m
    ));
    
    // In a real app, you would actually schedule the reminder/appointment here
  };

  return (
    <PageContainer title="AI Companion" subTitle="Your friendly ElderEase assistant">
      <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Chat header */}
        <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center">
          <div className="bg-indigo-100 p-2 rounded-full mr-3">
            <Bot className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="font-medium text-indigo-900">ElderEase Companion</h3>
            <p className="text-xs text-indigo-700">
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === 'user' ? (
                      <User size={16} className="mr-1" />
                    ) : (
                      <Bot size={16} className="mr-1" />
                    )}
                    <span className="text-xs opacity-80">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {renderMessageContent(message)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t border-slate-200 p-3 bg-slate-50">
          <div className="flex items-center">
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-full mr-2 ${isListening 
                ? 'bg-rose-100 text-rose-600' 
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border border-slate-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isListening}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className={`ml-2 p-2 rounded-full ${!input.trim() || isTyping
                ? 'bg-slate-200 text-slate-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              aria-label="Send message"
            >
              {isTyping ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          
          <div className="mt-2 flex justify-center space-x-2">
            <button 
              onClick={() => setInput('Set a reminder for my medication at 8am')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full transition-colors flex items-center"
            >
              <Clock size={12} className="mr-1" /> Reminder
            </button>
            <button 
              onClick={() => setInput('Schedule a doctor appointment for next Monday')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full transition-colors flex items-center"
            >
              <Calendar size={12} className="mr-1" /> Appointment
            </button>
            <button 
              onClick={() => setInput('I feel lonely today')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full transition-colors flex items-center"
            >
              <Smile size={12} className="mr-1" /> Talk
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Chatbot;