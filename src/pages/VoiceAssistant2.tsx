import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  AlertTriangle, 
  Volume2, 
  ChevronDown,
  Check,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

// Extend Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

type LanguageCode = 'en-US' | 'hi-IN' | 'ta-IN' | 'te-IN' | 'bn-IN';

interface LanguageInfo {
  name: string;
  nativeName: string;
  code: LanguageCode;
}

interface ConversationMessage {
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const languages: LanguageInfo[] = [
  { name: 'English', nativeName: 'English', code: 'en-US' },
  { name: 'Hindi', nativeName: 'हिंदी', code: 'hi-IN' },
  { name: 'Tamil', nativeName: 'தமிழ்', code: 'ta-IN' },
  { name: 'Telugu', nativeName: 'తెలుగు', code: 'te-IN' },
  { name: 'Bengali', nativeName: 'বাংলা', code: 'bn-IN' }
];

const VoiceAssistant2: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en-US');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [emergencyMessage, setEmergencyMessage] = useState<string>('');
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setNotification({
          show: true,
          message: `Error: ${event.error}`,
          type: 'error'
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setNotification({
        show: true,
        message: "Speech recognition not supported in this browser",
        type: 'error'
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  const handleVoiceInput = async (text: string) => {
    try {
      setIsProcessing(true);
      
      // Send to backend
      const formData = new FormData();
      formData.append('text', text);
      formData.append('language', selectedLanguage);
      formData.append('user_id', user?.id || 'anonymous');
      
      const response = await fetch('http://localhost:8000/voice-assistant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process voice input');
      }

      const data = await response.json();
      
      // Add messages to conversation
      setConversations(prev => [
        ...prev,
        {
          speaker: 'user',
          text: text,
          timestamp: new Date()
        },
        {
          speaker: 'ai',
          text: data.response,
          timestamp: new Date()
        }
      ]);
      
      // Speak the response
      speakResponse(data.response);
      
      if (data.response.toLowerCase().includes('emergency')) {
        setEmergencyMode(true);
      }
      
    } catch (error) {
      console.error("Error processing voice:", error);
      setNotification({
        show: true,
        message: "Error processing voice input. Please try again.",
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (isListening || isProcessing) return;
    
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    } else {
      setNotification({
        show: true,
        message: "Speech recognition not available",
        type: 'error'
      });
    }
  };

  const handleEmergencySubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          user_id: user?.id || 'anonymous',
          message: emergencyMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send emergency alert');
      }

      setNotification({
        show: true,
        message: "Emergency alert has been sent to your caregivers!",
        type: 'success'
      });
      setShowEmergencyDialog(false);
      setEmergencyMessage('');
      setEmergencyMode(false);
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      setNotification({
        show: true,
        message: "Failed to send emergency alert. Please try again.",
        type: 'error'
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PageContainer 
      title="Voice Assistant" 
      subTitle="Speak naturally to get assistance"
    >
      <div className="space-y-6">
        {emergencyMode && (
          <motion.div 
            className="bg-rose-50 border border-rose-100 rounded-xl p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="bg-rose-100 text-rose-600 p-2 rounded-lg mr-4">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-rose-800">Emergency Detected</h3>
                <p className="text-rose-700 text-sm">Would you like to alert your caregivers?</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors"
                  onClick={() => setEmergencyMode(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
                  onClick={() => setShowEmergencyDialog(true)}
                >
                  Send Alert
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.section
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-indigo-600 p-4 flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <Volume2 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">ElderEase Voice Assistant</h2>
              <p className="text-indigo-100 text-sm">Always ready to help</p>
            </div>
          </div>

          <div className="p-4 h-96 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Mic size={40} className="mb-4" />
                <p className="text-lg">Start speaking to begin conversation</p>
                <p className="text-sm mt-1">Try saying "Hello" or "I need help"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversations.map((msg, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, x: msg.speaker === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.speaker === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {msg.speaker === 'user' ? 'You' : 'Assistant'}
                        </span>
                        <span className={`text-xs ${msg.speaker === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                {isProcessing && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-xs md:max-w-md rounded-lg p-3 bg-slate-100 text-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Assistant</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={conversationEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 p-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="relative">
                <button 
                  className="flex items-center px-3 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                >
                  <Languages size={16} className="mr-2 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {languages.find(lang => lang.code === selectedLanguage)?.nativeName}
                  </span>
                  <ChevronDown size={16} className="ml-2 text-slate-500" />
                </button>
                
                {isLanguageDropdownOpen && (
                  <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                    {languages.map(language => (
                      <button
                        key={language.code}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${selectedLanguage === language.code ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setIsLanguageDropdownOpen(false);
                        }}
                      >
                        <span>{language.nativeName}</span>
                        {selectedLanguage === language.code && <Check size={16} className="text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={isListening ? () => recognitionRef.current?.stop() : startListening}
                disabled={isProcessing}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-md transition-all ${isListening ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Mic size={24} className="text-white" />
                )}
              </button>

              <div className="text-sm text-slate-500">
                {isListening ? (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></span>
                    Listening...
                  </span>
                ) : isProcessing ? (
                  "Processing..."
                ) : (
                  "Tap to speak"
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <AnimatePresence>
          {showEmergencyDialog && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-rose-600 text-white p-4 rounded-t-xl flex items-center">
                  <AlertTriangle size={20} className="mr-2" />
                  <h3 className="font-semibold">Emergency Alert</h3>
                </div>
                
                <div className="p-4">
                  <p className="text-slate-700 mb-4">Please describe your emergency situation:</p>
                  <textarea
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    value={emergencyMessage}
                    onChange={(e) => setEmergencyMessage(e.target.value)}
                    placeholder="I need help with..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 p-4 border-t border-slate-100">
                  <button 
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    onClick={() => setShowEmergencyDialog(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
                    onClick={handleEmergencySubmit}
                    disabled={!emergencyMessage.trim()}
                  >
                    Send Emergency Alert
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {notification.show && (
            <motion.div
              className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <Check size={18} className="mr-2" />
                ) : (
                  <AlertTriangle size={18} className="mr-2" />
                )}
                <span>{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
};

export default VoiceAssistant2;